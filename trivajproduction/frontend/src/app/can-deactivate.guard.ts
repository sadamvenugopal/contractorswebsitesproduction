import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<HomeComponent> {
  canDeactivate(): boolean {
    // Prevents navigating away from the home page
    return false;
  }
}
