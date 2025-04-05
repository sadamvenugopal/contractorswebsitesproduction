import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientformService {

  private apiUrl = `${environment.apiUrl}/google-sheets/submit-clientform`; // Updated to use environment-based URL
  // private apiUrl = `${environment.apiUrl}/submit-clientform`; // Dynamic API URL

  constructor(private http: HttpClient) {}

  submitClientForm(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
