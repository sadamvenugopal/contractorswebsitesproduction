// about.component.ts
import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit {
  
  
  customerReviews = [
    {
      name: 'John Doe',
      image: 'assets/images/customer1.jpg',
      text: 'Great service! Highly recommended.',
      rating: 5
    },
    {
      name: 'Jane Smith',
      image: 'assets/images/customer2.jpg',
      text: 'Very professional and timely work.',
      rating: 3
    },
    {
      name: 'Alex Johnson',
      image: 'assets/images/customer3.jpg',
      text: 'Quality work at a fair price. Will hire again!',
      rating: 4
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

    document.querySelectorAll('.about-text, .about-image, .team-card').forEach((el, index) => {
      (el as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
      observer.observe(el);
    });
  }
}