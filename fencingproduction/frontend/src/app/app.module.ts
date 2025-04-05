// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { GuestPageComponent } from './components/guest-page/guest-page.component';
import { HomeComponent } from './components/home/home.component';
import { ServicesComponent } from './components/services/services.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

import { CommonModule } from '@angular/common';
import { appRoutes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    GuestPageComponent,
    HomeComponent,
    ServicesComponent,
    GalleryComponent,
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    CommonModule // Ensure CommonModule is imported
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }