import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    const payload = { token, newPassword, confirmPassword };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    console.log("Sending reset password request:", payload); // Debugging
  
    return this.http.post<any>(`${this.apiUrl}/reset-password`, payload, { headers });
  }
  


}
