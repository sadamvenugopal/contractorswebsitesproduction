import { Component, OnInit } from '@angular/core';
import { LoginSignupService } from '../../services/login-signup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  template: `<p>Loading...</p>`
})
export class AuthCallbackComponent implements OnInit {
  constructor(private loginSignupService: LoginSignupService, private router: Router) {}

  ngOnInit() {
    this.loginSignupService.handleGoogleCallback();
  }
}