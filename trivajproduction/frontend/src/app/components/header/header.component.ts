import { Component, HostListener } from '@angular/core';
import { PricingComponent } from '../pricing/pricing.component';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from '../gallery/gallery.component';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
import { FooterComponent } from '../footer/footer.component';
import { MockupService } from '../../services/mockup.service';
import { AdminNotificationService } from '../../services/admin-notification.service'; // Import the notification service
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  styleUrls: ['./header.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    PricingComponent,
    LoginSignupComponent,
    FooterComponent,
    GalleryComponent,
  ],
})
export class HeaderComponent {
  isMenuOpen: boolean = false;
  isMockupFormVisible: boolean = false; // Controls visibility of the mockup form modal
  isSignUpFormVisible: boolean = false; // Controls visibility of the sign-up form modal
  isOTPVisible: boolean = false; // Controls visibility of the OTP verification modal
  isOTPVerified: boolean = false; // Controls visibility of the success popup
  enteredOTP: string = ''; // Stores the OTP entered by the user
  windowWidth: number = window.innerWidth;
  isLoading: boolean = false;

  services = [
    { 
      icon: 'webdevelopment.png', 
      title: 'Web Development',
      points: [
        'Convert visitors, stand out.',
        'Engage visitors, drive conversions.',
        'Creative, functional, conversion-driven.',
        'Stunning sites, high impact.',
        'Expert sites, boost conversions.'
      ]
    },
    { 
      icon: 'leadgeneration.png',
      title: 'Lead Generation',
      points: [
        'Targeted strategies, qualified leads.',
        'Attract, engage, convert leads.',
        'Focused strategies, real results.',
        'Transform prospects into loyal customers.',
        'Capture leads, elevate your business.'
      ]
    },
    { 
      icon: 'digitalmarketing.png', 
      title: 'Digital Marketing',
      points: [
        'Grow online, reach customers.',
        'Dominate online with expert marketing.',
        'Elevate your brand with digital.',
        'Reach, engage, convert online.',
        'Expert strategies, impactful results.'
      ]
    },
    { 
      icon: 'branding.png', 
      title: 'Branding',
      points: [
        'Create unique, memorable identity.',
        'Craft your unique brand.',
        'Set your brand apart.',
        'Build a compelling brand story.',
        'Craft your brand’s voice.',
        'Create impact, inspire loyalty.'
      ]
    }
  ];  

  countries = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'USA' },
  ];

  constructor(
    private mockupService: MockupService,
    private adminNotificationService: AdminNotificationService, private router:Router
  ) {}


  ngOnInit() {
    // Show the mockup form automatically after 3 seconds
    setTimeout(() => {
      this.isMockupFormVisible = true;
    }, 3000);
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const hamburgerElement = document.querySelector('.hamburger');
    hamburgerElement?.classList.toggle('active', this.isMenuOpen);
  }

  closeMenu() {
    this.isMenuOpen = false;
    const hamburgerElement = document.querySelector('.hamburger');
    hamburgerElement?.classList.remove('active');
  }

  navigateToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.closeMenu();
    }
  }

  openMockupFormAndCloseMenu() {
    this.isMockupFormVisible = true;
    this.closeMenu();
  }

  closeMockupForm() {
    this.isMockupFormVisible = false;
  }

  closeAllModals() {
    this.isMockupFormVisible = false;
    this.isOTPVisible = false;
    this.isOTPVerified = false;
  }

  openSignUpFormAndCloseMenu() {
    this.isSignUpFormVisible = true;
    this.closeMenu();
  }

  closeSignUpForm() {
    this.isSignUpFormVisible = false;
  }


  submitMockupForm(event: Event) {
    event.preventDefault();
    this.isLoading = true;
  
    const target = event.target as HTMLFormElement;
    const formData = {
      name: (target.querySelector('#name') as HTMLInputElement)?.value || '',
      email: (target.querySelector('#email') as HTMLInputElement)?.value || '',
      phone: (target.querySelector('#phone') as HTMLInputElement)?.value || '',
      description: (target.querySelector('#description') as HTMLTextAreaElement)?.value || '',
    };
  
    // Store data in localStorage
    if (formData.email) {
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userPhone', formData.phone);
      localStorage.setItem('userDescription', formData.description);
    } else {
      console.error('Email is missing from the form!');
      alert('Please enter a valid email.');
      this.isLoading = false;
      return;
    }
  
    if (!this.validateForm(formData)) {
      this.isLoading = false;
      return;
    }
  
    this.mockupService.addMockupForm(formData).subscribe({
      next: (response) => {
        console.log('Form submitted successfully:', response);
        localStorage.setItem('mockupId', response.id); // Store mockup ID
        this.isMockupFormVisible = false;
        this.isOTPVisible = true;
        alert('OTP sent to your email! Please check your inbox.');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error submitting form:', error);
        alert('There was an issue submitting your form. Please try again later.');
        this.isLoading = false;
      },
    });
  }
  

  
  
  verifyOTP() {
    if (!this.enteredOTP) {
      alert('Please enter the OTP.');
      return;
    }
  
    this.isLoading = true;
    const userEmail = localStorage.getItem('userEmail'); // Fetch email from localStorage
  
    if (!userEmail) {
      console.error('User email not found in localStorage');
      alert('Issue verifying the OTP or User Already Exist.');
      this.isLoading = false;
      return;
    }
  
    this.mockupService.verifyOTP(userEmail, this.enteredOTP).subscribe({
      next: () => {
        alert('OTP Verified! Submission successful.');
        this.isOTPVisible = false;
        this.isOTPVerified = true;
        this.enteredOTP = '';
  
        // After OTP verification, save form data to Firestore
        const formData = {
          name: localStorage.getItem('userName'),
          email: userEmail,
          phone: localStorage.getItem('userPhone'),
          description: localStorage.getItem('userDescription')
        };
  
        console.log(formData); // Check form data before saving
  
        this.mockupService.saveFormToFirestore(formData).subscribe({
          next: (response) => {
            if (response) {
              console.log('Form saved to Firestore:', response);
            } else {
              console.log('Form not saved, user already exists.');
            }
            this.isLoading = false;
            console.log('Navigating to dashboard...');
            this.router.navigateByUrl('/dashboard')
          },
          error: (error) => {
            console.error('Error saving form to Firestore:', error);
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        alert('Invalid OTP. Please try again.');
        console.error(error);
        this.isLoading = false;
      },
    });
  }
  
  
  


  closeOTPVerifiedPopup() {
    this.isOTPVerified = false;
    this.closeMockupForm();
  }

  private resetForm() {
    this.enteredOTP = '';
    this.isMockupFormVisible = false;
    const form = document.querySelector('form');
    if (form) {
      form.reset();
    }
  }

  private validateForm(formData: { name: string; email: string; phone: string; description: string }): boolean {
    const nameRegex = /^[a-zA-Z]{3,30}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^(\+91)?\d{10,15}$/;
    const descriptionWordCount = this.countWords(formData.description);
  
    if (!nameRegex.test(formData.name)) {
      alert('Name must contain only letters and be between 3 and 30 characters.');
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      alert('Email must be a valid Gmail address.');
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      alert('Phone number must be 10 to 15 digits long and may include country code.');
      return false;
    }
    if (descriptionWordCount < 20 || descriptionWordCount > 100) {
      alert('Description must contain between 20 and 100 words.');
      return false;
    }
    return true;
  }

  private countWords(input: string): number {
    return input.trim().split(/\s+/).length;
  }
}
