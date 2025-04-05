import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  navigateToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      // Scroll into view smoothly
      element.scrollIntoView({ behavior: 'smooth' });

    }
  }
  openMockupFormAndCloseMenu() {
    // Logic to open the mockup form and close the menu
    console.log("Opening Mockup Form and closing menu.");
  }
}
