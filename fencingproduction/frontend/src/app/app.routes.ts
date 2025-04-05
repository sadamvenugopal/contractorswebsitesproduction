import { Routes } from '@angular/router';
import { GuestPageComponent } from './components/guest-page/guest-page.component';
import { HomeComponent } from './components/home/home.component';
import { ServicesComponent } from './components/services/services.component';
import { GalleryComponent } from './components/gallery/gallery.component';

export const appRoutes: Routes = [
  {
    path: 'guest',
    component: GuestPageComponent, // This is the main wrapper component
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'gallery', component: GalleryComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'guest/home' } // Redirect unknown routes
];
