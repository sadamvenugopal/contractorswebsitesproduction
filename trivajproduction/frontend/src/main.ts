import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp, getApp, getApps } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { provideHttpClient } from '@angular/common/http';
import { SocialAuthServiceConfig, SocialLoginModule, GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { appRoutes } from './app/app.routes';
import { RouterModule } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRkD3Xk4DmhkdZitJt5ec5fpwU6PV2gcA",
  authDomain: "userlogin-b9efd.firebaseapp.com",
  projectId: "userlogin-b9efd",
  storageBucket: "userlogin-b9efd.firebasestorage.app",
  messagingSenderId: "743199998332",
  appId: "1:743199998332:web:6531f91db89e3fb1cf64f9"
};

// Initialize Firebase explicitly
if (getApps().length === 0) {
  console.log('Initializing Firebase');
  initializeApp(firebaseConfig);
} else {
  console.log('Firebase already initialized');
}

// Bootstrap Application
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(appRoutes)),  // Import routes
    provideHttpClient(),
    provideFirebaseApp(() => getApp()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),

    // Social Authentication Providers (Fix: No "provideSocialAuth")
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false, // Change to true if needed
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('YOUR_GOOGLE_CLIENT_ID')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('YOUR_FACEBOOK_CLIENT_ID')
          }
        ]
      } as SocialAuthServiceConfig
    }, provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyCRkD3Xk4DmhkdZitJt5ec5fpwU6PV2gcA",
      authDomain: "userlogin-b9efd.firebaseapp.com",
      projectId: "userlogin-b9efd",
      storageBucket: "userlogin-b9efd.firebasestorage.app",
      messagingSenderId: "743199998332",
      appId: "1:743199998332:web:6531f91db89e3fb1cf64f9"
          })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "userlogin-b9efd", appId: "1:743199998332:web:6531f91db89e3fb1cf64f9", storageBucket: "userlogin-b9efd.firebasestorage.app", apiKey: "AIzaSyCRkD3Xk4DmhkdZitJt5ec5fpwU6PV2gcA", authDomain: "userlogin-b9efd.firebaseapp.com", messagingSenderId: "743199998332" })), provideFirestore(() => getFirestore()), provideAnimationsAsync(), provideAnimationsAsync()
  ]
})
  .catch(err => console.error('Error bootstrapping application:', err));
