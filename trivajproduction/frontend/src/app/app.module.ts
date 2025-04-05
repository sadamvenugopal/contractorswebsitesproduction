import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';

import { MockupService } from './services/mockup.service';
import { LoginSignupService } from './services/login-signup.service';
import { AdminNotificationService } from './services/admin-notification.service';

// Social Login
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { appRoutes } from './app.routes';
import { ClientformComponent } from './components/clientform/clientform.component';
import { ClientformService } from './services/clientform.service';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ClientformComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SocialLoginModule, // ✅ Added SocialLoginModule for Google & Facebook login
    RouterModule.forRoot(appRoutes), // Configure routes


  ],
  providers: [
    MockupService,
    LoginSignupService,
    AdminNotificationService,
    ClientformService,
    AuthGuard,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('683383393221-qbfhqcn7h36nj2sbbooit9nvdoprsd6k.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('YOUR_FACEBOOK_APP_ID')
          }
        ]
      } as SocialAuthServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
