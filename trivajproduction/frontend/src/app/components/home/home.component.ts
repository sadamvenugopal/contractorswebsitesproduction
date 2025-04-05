import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FinalFormService } from '../../services/final-form.service';
import { LoginSignupService } from '../../services/login-signup.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [ReactiveFormsModule, CommonModule],

})
export class HomeComponent implements OnInit {

  user: { name: string; email: string } | null = null;
  homeForm: FormGroup;
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  price: string = '';  // Holds the selected price

  showDropdown: boolean = false;

    // Define prices for each bundle
    bundlePrices: { [key: string]: string } = {
      startup: '$179',
      eliteCorporate: '$379',
      highEndBusiness: '$1279',
      eStoreWebdesign: '$1279',
      advanceEcommerce: '$1549',
      advancedBusiness: '$1599',
      customWebPortal: '$4999',
      customOnlineStore: '$6999',
    };
    constructor(
      private fb: FormBuilder,
      private router: Router,
      private finalFormService: FinalFormService, // Inject the service
      private    authService: LoginSignupService) 

    {
      this.homeForm = this.fb.group({
        businessName: ['', Validators.required],
        contactPerson: ['', Validators.required],
        mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        businessEmail: ['', [Validators.required, Validators.email]],
        officePhone: [''],
        contactEmail: ['', [Validators.required, Validators.email]],
        address: ['', Validators.required],
        bundleSelection: ['startup', Validators.required],
        howSoon: ['', Validators.required],
        price: ['', Validators.required] // Adding price as a form control
      });
      this.updatePrice(); // Set the initial price based on the default bundle
    }

    updatePrice() {
      const selectedBundle = this.homeForm.get('bundleSelection')?.value;
      this.price = this.bundlePrices[selectedBundle] || '';
      this.homeForm.get('price')?.setValue(this.price); // Update form value
    }


    submitFinalForm() {
      if (this.homeForm.invalid) {
        this.errorMessage = 'Please fill all required fields.';
        this.homeForm.markAllAsTouched();
        return;
      }
    
      this.isSubmitting = true;
      this.successMessage = '';
      this.errorMessage = '';
    
      const formData = { ...this.homeForm.value };
      Object.keys(formData).forEach((key) => {
        if (typeof formData[key] === 'string') {
          formData[key] = formData[key].trim();
        }
      });
    
      console.log('✅ Sending Data:', formData);
    
      this.finalFormService.submitFinalForm(formData).subscribe({
        next: (response) => {
          console.log('✅ Success:', response);
          this.successMessage = 'Form submitted successfully!';
          alert('Form submitted, Congratulations ✅');
          this.isSubmitting = false;
    
          // Navigate to Thank You page without delay
          this.router.navigate(['/thank-you']);
        },
        error: (error) => {
          console.error('❌ Error:', error);

          this.errorMessage = 'Failed to submit form. Please try again.';
          alert(' Form Not submitted,  ❌');
          
          this.isSubmitting = false;
        },
      });
    }
    
  
    ngOnInit() {
      this.user = this.authService.getUser(); // Get user details
    }
    
  toggleProfileDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  
  logout() {
    this.authService.logout();
    
  }
  
}