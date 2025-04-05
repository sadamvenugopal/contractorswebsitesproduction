import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginSignupService } from '../../services/login-signup.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class LoginSignupComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  signUpForm: FormGroup;
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSignUpFormVisible = true;
  isLoginFormVisible = false;
  isForgotPasswordFormVisible = false;

  constructor(
    private fb: FormBuilder,
    private loginSignupService: LoginSignupService,
    private authService: LoginSignupService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.loginSignupService.handleGoogleCallback(); // Check for Google login callback token
    //  this.authService.handleGoogleCallback();

  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  closeForm() {
    this.isVisible = false;
    this.close.emit();
  }

  closeModal() {
    console.log('Closing modal');
    this.closeForm();
  }

  async submitSignUpForm(event: Event) {
    event.preventDefault();
    this.clearMessages();
    if (this.signUpForm.invalid) {
      this.showErrorMessage('Please fill out all required fields correctly.');
      return;
    }
    try {
      await this.loginSignupService.signUp(this.signUpForm.value);
      this.showSuccessMessage('Sign up successful! Please check your email to verify your account.');
      this.openLoginForm();
    } catch (error) {
      this.showErrorMessage(this.extractErrorMessage(error) || 'Sign up failed. Please try again.');
    }
  }

  async submitLoginForm(event: Event) {
    event.preventDefault();
    this.clearMessages();
    if (this.loginForm.invalid) {
      this.showErrorMessage('Please enter a valid email and password.');
      return;
    }
    try {
      const response = await this.loginSignupService.login(this.loginForm.value).toPromise();
      this.loginSignupService.setAuthToken(response.token);
      this.showSuccessMessage('Login successful!');
      this.closeForm();
    } catch (error) {
      this.showErrorMessage(this.extractErrorMessage(error) || 'Login failed. Check your credentials.');
    }
  }

  async submitForgotPasswordForm(event: Event) {
    event.preventDefault();
    this.clearMessages();
    if (this.forgotPasswordForm.invalid) {
      this.showErrorMessage('Please enter a valid email.');
      return;
    }
    try {
      await this.loginSignupService.forgotPassword(this.forgotPasswordForm.value.email);
      this.showSuccessMessage('Password reset email sent!');
    } catch (error) {
      this.showErrorMessage(this.extractErrorMessage(error) || 'Error sending reset email.');
    }
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  extractErrorMessage(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    } else if (typeof error === 'string') {
      return error;
    } else {
      return '';
    }
  }

  showSuccessMessage(message: string) {
    window.alert(message); // Use plain alert for success messages
  }

  showErrorMessage(message: string) {
    window.alert(message); // Use plain alert for error messages
  }



  openLoginForm() {
    console.log('Opening login form');
    this.isSignUpFormVisible = false;
    this.isForgotPasswordFormVisible = false;
    this.isLoginFormVisible = true;
  }
  
  openSignUpForm() {
    console.log('Opening sign-up form');
    this.isLoginFormVisible = false;
    this.isForgotPasswordFormVisible = false;
    this.isSignUpFormVisible = true;
  }
  
  openForgotPasswordForm() {
    console.log('Opening forgot password form');
    this.isLoginFormVisible = false;
    this.isSignUpFormVisible = false;
    this.isForgotPasswordFormVisible = true;
  }

  googleLogin() {
    try {
      this.loginSignupService.googleLogin();
      this.showSuccessMessage('Google login successful!');
    } catch (error) {
      console.error('Google login error:', error);
    }
  }

  facebookLogin() {
    try {
      this.loginSignupService.facebookLogin();
      this.showSuccessMessage('Facebook login successful!');
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  }
}