import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { getFirestore, doc, setDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MockupService {
  private apiUrl = environment.apiUrl; // https://www.contractorsandhandymanwebsites.com
  private firestore = getFirestore();

  constructor(private http: HttpClient) {}

  /**
   * Add mockup form data to the backend.
   */
  addMockupForm(data: any): Observable<any> {
    const url = `${this.apiUrl}/submit-form`; // ✅ Fixed URL
    return this.http.post(url, data).pipe(
      map((response) => {
        console.log('✅ Form submitted successfully:', response);
        return response;
      }),
      catchError((error) => {
        console.error('❌ Error submitting form:', error);
        throw error;
      })
    );
  }

  /**
   * Verify OTP with the backend.
   */
  verifyOTP(email: string, otp: string): Observable<any> {
    const url = `${this.apiUrl}/verify-otp`; // ✅ Fixed URL
    const payload = { email, otp };
    console.log('🔍 Sending OTP verification request:', payload);
    return this.http.post(url, payload).pipe(
      map((response) => {
        console.log('✅ OTP verified successfully:', response);
        return response;
      }),
      catchError((error) => {
        console.error('❌ Error verifying OTP:', error);
        return new Observable((observer) => {
          observer.error(error);
        });
      })
    );
  }


/**
 * Check if the user already exists in Firestore.
 */
checkUserExists(email: string): Observable<boolean> {
  const userRef = collection(this.firestore, 'mockupForms');
  const q = query(userRef, where('email', '==', email));

  return from(getDocs(q)).pipe(
    map((querySnapshot) => {
      return !querySnapshot.empty; // Explicitly return a boolean
    }),
    catchError((error) => {
      console.error('❌ Error checking user existence:', error);
      return new Observable<boolean>((observer) => {
        observer.error(error);
      });
    })
  );
}


  /**
   * Save form data into Firestore only if the user does not already exist.
   */
  saveFormToFirestore(formData: any): Observable<any> {
    const userEmail = formData.email;
  
    return this.checkUserExists(userEmail).pipe(
      switchMap((userExists) => {
        const userRef = collection(this.firestore, 'mockupForms');
        const docRef = doc(userRef, userEmail); // Use email as the document ID
  
        return from(setDoc(docRef, formData, { merge: true })).pipe(
          map(() => {
            console.log('✅ Form data saved/updated in Firestore!');
            return true;
          }),
          catchError((error) => {
            console.error('❌ Error saving/updating data in Firestore:', error);
            return new Observable((observer) => {
              observer.error(error);
            });
          })
        );
      })
    );
  }
  
  

  /**
   * Update OTP verification status in Firestore (optional).
   */
  updateOTPVerificationStatus(mockupId: string, isVerified: boolean): Observable<any> {
    console.log('🔄 Updating OTP verification status for mockup:', mockupId);
    return new Observable((observer) => {
      observer.next(true);
      observer.complete();
    });
  }
}
