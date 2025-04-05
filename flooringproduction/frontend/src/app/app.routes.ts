import { Routes } from '@angular/router';
import { GuestComponent } from './components/guest/guest.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { ServiceComponent } from './components/service/service.component';

export const routes: Routes = [
  { 
    path: '', 
    component: GuestComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, data: { section: 'home' } },
      { path: 'services', component: ServiceComponent, data: { section: 'services' } },
      { path: 'about', component: AboutComponent, data: { section: 'about' } },
      { path: '**', redirectTo: 'home' }
    ]
  }
];