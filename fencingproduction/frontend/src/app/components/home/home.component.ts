// home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ],
  standalone: true
})
export class HomeComponent implements OnInit{
  isMockupFormVisible = false;
  isOTPVisible = false;
  enteredOTP = '';
  isContentVisible:boolean= true;
  activeSlide = 0;


  contactDetails = [
    { title: "Get in Touch", label: "Address", value: "123 Main Street, Atlanta, GA", icon: "📍" },
    { title: "Call Us", label: "Phone", value: "+14085822759", icon: "📞" },
    { title: "Email Us", label: "Email", value: "contact@yourdomain.com", icon: "📧" }
  ];

  ngOnInit() {
    setTimeout(() => {
      this.isContentVisible = true;
    }, 500); // Delay to trigger the transition

    setInterval(() => {
      this.activeSlide = (this.activeSlide + 1) % this.contactDetails.length;
    }, 2000); // Change slide every 3 seconds
  }
    
  

  openMockupFormAndCloseMenu(): void {
    this.isMockupFormVisible = true;
  }

  closeAllModals(): void {
    this.isMockupFormVisible = false;
    this.isOTPVisible = false;
  }

  submitMockupForm(event: Event): void {
    event.preventDefault();
    // Implement form submission logic
    this.isMockupFormVisible = false;
    this.isOTPVisible = true;
  }

  verifyOTP(): void {
    // Implement OTP verification logic
    this.isOTPVisible = false;
    alert('OTP Verified!');
  }

  openSignUpFormAndCloseMenu(): void {
    // Implement logic to open signup form
  }
}