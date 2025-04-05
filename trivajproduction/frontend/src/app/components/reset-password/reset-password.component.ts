import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '../../services/reset-password.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports: [ReactiveFormsModule,CommonModule]
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;  // ✅ Define resetForm
  token: string | null = null;
  errorMessage: string = '';  // ✅ Define errorMessage
  successMessage: string = ''; // ✅ Define successMessage

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private resetPasswordService: ResetPasswordService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log("Received reset token:", this.token);

    // ✅ Initialize the form
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatchValidator });
  }

  // ✅ Custom validator to check if passwords match
  passwordsMatchValidator(group: FormGroup) {
    return group.get('password')?.value === group.get('confirmPassword')?.value 
      ? null 
      : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) {
      this.errorMessage = "Invalid form or missing token!";
      return;
    }

    const { password, confirmPassword } = this.resetForm.value;

    this.resetPasswordService.resetPassword(this.token, password, confirmPassword)
      .subscribe(
        response => {
          this.successMessage = "Password reset successful!";
          alert("Your password has been reset successfully!"); // ✅ Show success alert
          console.log("password reset succesfully ✅")
          this.router.navigate(['/']); // Redirect to login
        },
        error => {
          this.errorMessage = error.error.message || "Error resetting password!";
          alert(this.errorMessage); // ✅ Show error alert
        }
      );
  }
}
