import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
  user?: any; // Optional, in case you return user details
}

@Injectable({ providedIn: 'root' })
export class LoginSignupService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  // private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient, private router: Router, private location: Location) {
    // this.handleGoogleCallback(); // ✅ Automatically check for token

  }

  // ✅ Signup API call
  signUp(data: any): Promise<any> {
    return this.http.post(`${this.apiUrl}/register`, data).toPromise();
  }

  // ✅ Login API call with token
  login(data: any): Observable<any> {
    return this.http.post<{ token: string; user: { name: string; email: string } }>(
      `${this.apiUrl}/login`, data
    ).pipe(
      tap(response => {
        console.log("Login Successful. Storing auth token.");
        this.setAuthToken(response.token);
        this.setUser(response.user);
        this.router.navigate(['/home']).then(() => {
          this.location.replaceState('/home');
        });
      })
    );
  }
  
  // ✅ Forgot password request (sends reset link)
  forgotPassword(email: string): Promise<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).toPromise();
  }



  // ✅ Store User Data
  setUser(user: { name: string; email: string }) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // ✅ Store Auth Token (Only if it's NOT a reset token)
  setAuthToken(token: string) {
    console.log("Setting authToken:", token);
    localStorage.setItem('authToken', token);
  }

 

  // ✅ Get Token from Local Storage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // ✅ Check Authentication Status
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // ✅ Handle token expiry manually (if needed)
    const expiryTime = localStorage.getItem('tokenExpiry');
    if (expiryTime && Date.now() >= +expiryTime) {
      console.warn("Token expired. Logging out.");
      this.logout();
      return false;
    }

    return true;
  }

  // ✅ Handle Google Login Redirect
  handleGoogleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const name = urlParams.get('name') || '';
    const email = urlParams.get('email') || '';
  
    console.log("Extracted Token:", token);
  
    if (token) {
      console.log("Google Login Success. Storing token and redirecting to home.");
      this.setAuthToken(token);
      this.setUser({ name, email });
  
      this.router.navigate(['/home']).then(() => {
        this.location.replaceState('/home');
      });
    } else {
      console.error("No valid token found. Redirecting to login.");
      this.router.navigate(['/']).then(() => {
        this.location.replaceState('/');
      });
    }
  }
  
  

  // ✅ Redirect for Google Login
  googleLogin() {
    window.location.href = `${this.apiUrl}/google`;
  }

  // ✅ Redirect for Facebook Login
  facebookLogin() {
    window.location.href = `${this.apiUrl}/facebook`;
  }

  // ✅ Get Authorization Headers
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ✅ Logout User
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    console.log("User logged out.");
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  // ✅ Get Logged-in User Info
  getUser(): { name: string; email: string } | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
