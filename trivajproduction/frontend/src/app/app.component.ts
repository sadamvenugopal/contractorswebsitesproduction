import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { LoginSignupService } from './services/login-signup.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent 
implements OnInit
 {
  title = 'trivaj';
  activeSection: string = 'home'; // Default section

  constructor(private authService: LoginSignupService, private router: Router, private location: Location) {}

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token') && urlParams.get('name') && urlParams.get('email')) {
      this.authService.handleGoogleCallback();
    }
  }
}
