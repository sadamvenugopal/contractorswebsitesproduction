// footer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [
    CommonModule
  ],
  standalone: true
})
export class FooterComponent {

  constructor(
    private router: Router,

  ){}

  navigateTo(path: string) {
    this.router.navigate([path]).then(() => {
    });
}
}