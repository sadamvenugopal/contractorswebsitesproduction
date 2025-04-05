// service.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent {
  services = [
    {
      title: 'Hardwood Flooring',
      description: 'Elegant and durable hardwood flooring options for your home or business.',
      icon: '/hardwood.png'

    },
    {
      title: 'Laminate Flooring',
      description: 'Affordable and stylish laminate flooring solutions with easy maintenance.',
      icon: '/laminate.png'

    },
    {
      title: 'Vinyl Flooring',
      description: 'Water-resistant and versatile vinyl flooring for any space.',
      icon: '/vinyl.png',

    },
    {
      title: 'Tile Flooring',
      description: 'Beautiful and durable tile flooring for kitchens, bathrooms, and more.',
      icon: '/tile.png'

    },
    {
      title: 'Carpet Installation',
      description: 'Soft and cozy carpet installation services for comfort and style.',
      icon: '/carpet.png'

    },
    {
      title: 'Floor Refinishing',
      description: 'Restore the beauty of your floors with our expert refinishing services.',
      icon: '/floorRefinish.png'

    }
  ];
  

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
  
    document.querySelectorAll('.service-card').forEach((el, index) => {
      (el as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
      observer.observe(el);
    });
  }
}