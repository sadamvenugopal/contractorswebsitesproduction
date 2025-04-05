import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images = [
    {
      url: '/slide1.png',
      alt: 'Premium Hardwood Flooring',
      title: 'Luxury Hardwood Flooring',
      description: 'Transform your home with our exquisite collection of solid and engineered hardwood floors'
    },
    {
      url: '/slide2.png',
      alt: 'Waterproof Vinyl Plank Flooring',
      title: 'Durable & Stylish Vinyl Planks',
      description: '100% waterproof luxury vinyl perfect for kitchens, bathrooms, and high-traffic areas'
    },
    {
      url: '/slide3.png',
      alt: 'Tile Flooring Selection',
      title: 'Elegant Tile Solutions',
      description: 'Ceramic, porcelain, and natural stone tiles for timeless beauty'
    },
    {
      url: '/slide4.png',
      alt: 'High-Quality Laminate Flooring',
      title: 'Affordable Laminate Options',
      description: 'Realistic wood looks with exceptional durability at budget-friendly prices'
    },
    {
      url: '/slide5.png',
      alt: 'Commercial Flooring Installation',
      title: 'Commercial Flooring Experts',
      description: 'Specialized flooring solutions for businesses, offices, and retail spaces'
    }
  ];
  
  currentSlide = 0;
  slideInterval: any;

  ngOnInit() {
    this.startSlideShow();
  }

  startSlideShow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    clearInterval(this.slideInterval);
    this.startSlideShow();
  }
}