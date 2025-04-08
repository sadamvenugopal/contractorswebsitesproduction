import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetService {
  private backendUrl = `${environment.backendUrl}/api/booknow`;

  constructor(private http: HttpClient) {}

  submitForm(formData: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/submit-booking`, formData);
  }
}
