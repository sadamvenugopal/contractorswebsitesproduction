import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { ServicesComponent } from '../services/services.component';

@Component({
  selector: 'app-guest-page',
  standalone: true,
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.css'],
  imports: [
    RouterModule, CommonModule, HomeComponent, ServicesComponent,
    HeaderComponent, FooterComponent, GalleryComponent
  ],
})
export class GuestPageComponent {
  showAllComponents: boolean = true; // Show all components initially
  currentUrl: string = ''; // Store the current URL

  constructor(public router: Router) { // Change 'private' to 'public'
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;

        if (this.currentUrl.includes('/guest/services') || this.currentUrl.includes('/guest/gallery')) {
          this.showAllComponents = false;
        } else {
          this.showAllComponents = true; // Show all components on home
        }
      }
    });
  }
}
