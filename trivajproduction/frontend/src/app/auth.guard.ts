import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginSignupService } from './services/login-signup.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private loginSignupService: LoginSignupService) {}

  canActivate(): boolean | UrlTree {
    const currentUrl = this.router.url;
    console.log('Current URL:', currentUrl); 
  
    if (currentUrl.includes('/reset-password')) {
      console.log('Allowing access to reset-password');
      return true; // ✅ Always allow reset-password
    }
  
    if (this.loginSignupService.isLoggedIn()) {
      console.log('User is logged in, allowing access');
      return true;
    } else {
      console.log('User not logged in, redirecting to login');
      return this.router.parseUrl('/login');
    }
  }
  
  
}
