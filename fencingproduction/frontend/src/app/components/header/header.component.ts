import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleSheetService } from '../../services/google-sheet.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class HeaderComponent implements OnInit {
    isMenuOpen: boolean = false;
    windowWidth: number = window.innerWidth;
    isMockupOpen: boolean = false;

    mockupData = {
        name: '',
        email: '',
        phone:'',
        requirements: '',
        date:''
    };

    minDate: string = ''; // Store today's date in YYYY-MM-DD format

    countries = [
        { code: '+91', name: 'India' },
        { code: '+1', name: 'USA' },
    ];

    constructor(
        private router: Router,
        private googleSheetService: GoogleSheetService
    ) {
      this.setMinDate(); // Initialize minDate
     }

    ngOnInit() {
        this.updateWindowWidth();

        setTimeout(() => {
            this.isMockupOpen = true;
        }, 3000);
    }

    @HostListener('window:resize', ['$event'])
    updateWindowWidth() {
        this.windowWidth = window.innerWidth;

        if (this.windowWidth > 768) {
            this.isMenuOpen = false;
        }
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu() {
        this.isMenuOpen = false;
    }

    toggleMockupForm() {
        this.isMockupOpen = !this.isMockupOpen;
    }

    setMinDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2-digit format
      const day = today.getDate().toString().padStart(2, '0'); // Ensure 2-digit format
      this.minDate = `${year}-${month}-${day}`;
    }

    submitMockupForm(event: Event) {
      event.preventDefault(); // Prevent default form submission
  
      this.googleSheetService.submitForm(this.mockupData).subscribe({
          next: (response) => {
              alert('Booking submitted successfully!');
              this.toggleMockupForm(); // Close form after successful submission
          },
          error: (error) => {
              if (error.status === 400) {
                  alert('This email already exists! Please use a different email.');
              } else {
                  alert('Failed to submit booking. Please try again.');
              }
          }
      });
  }
  
  
    navigateTo(path: string) {
        this.router.navigate([path]).then(() => {
            this.closeMenu();
        });
    }
}
