import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminNotificationService {
  private apiUrl = environment.apiUrl; // https://www.contractorsandhandymanwebsites.com
  // private backendBaseUrl = environment.apiUrl; // Use environment variable

  constructor(private http: HttpClient) {}

  /**
   * Notify admin about a new form submission.
   */
  notifyAdmin(formData: any): Observable<any> {
    const url = `${this.apiUrl}/submit-form`;
    return this.http.post(url, formData).pipe(
      map((response) => {
        console.log('Admin notification sent successfully:', response);
        return response;
      }),
      catchError((error) => {
        console.error('Error sending admin notification:', error);
        throw error;
      })
    );
  }
}