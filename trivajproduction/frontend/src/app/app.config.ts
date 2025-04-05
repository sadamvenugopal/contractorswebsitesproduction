import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp, getApp, getApps } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

const firebaseConfig = {
  apiKey: "AIzaSyCRkD3Xk4DmhkdZitJt5ec5fpwU6PV2gcA",
  authDomain: "userlogin-b9efd.firebaseapp.com",
  projectId: "userlogin-b9efd",
  storageBucket: "userlogin-b9efd.firebasestorage.app",
  messagingSenderId: "743199998332",
  appId: "1:743199998332:web:6531f91db89e3fb1cf64f9"
};

export const appConfig: ApplicationConfig = {
  providers: [  
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),

    // Initialize Firebase only if not already initialized
    provideFirebaseApp(() => {
      try {
        if (getApps().length === 0) {
          console.log('Initializing Firebase');
          return initializeApp(firebaseConfig);
        } else {
          console.log('Firebase already initialized');
          return getApp();
        }
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        throw error;
      }
    }),

    // Provide Auth with error handling
    provideAuth(() => {
      try {
        return getAuth();
      } catch (error) {
        console.error('Error getting Auth:', error);
        throw error;
      }
    }),

    // Provide Firestore with error handling
    provideFirestore(() => {
      try {
        return getFirestore();
      } catch (error) {
        console.error('Error getting Firestore:', error);
        throw error;
      }
    }),

    // Provide Messaging with error handling
    provideMessaging(() => {
      try {
        return getMessaging();
      } catch (error) {
        console.error('Error getting Messaging:', error);
        throw error;
      }
    })
  ]
};