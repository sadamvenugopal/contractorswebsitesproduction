import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceComponent } from '../service/service.component';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { FooterComponent } from '../footer/footer.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { MapComponent } from '../map/map.component';


@Component({
  selector: 'app-guest',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavigationComponent,
    HomeComponent,
    ServiceComponent,
    AboutComponent,
    GalleryComponent,
    MapComponent,
    FooterComponent
  ],
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements AfterViewInit {
  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const fragment = this.router.url.split('#')[1];
        if (fragment) {
          this.scrollTo(fragment);
        }
      });
  }

  scrollTo(section: string) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}