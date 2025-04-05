import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // Makes the service available application-wide
})
export class FinalFormService {
  private apiUrl = `${environment.apiUrl}/final-sheet/submit-finalform`; // Updated to use environment-based URL
  // private apiUrl = `${environment.apiUrl}/submit-finalform`; // Use environment-based API URL

  constructor(private http: HttpClient) {}

  submitFinalForm(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}