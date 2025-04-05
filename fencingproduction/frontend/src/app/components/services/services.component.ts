import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class ServicesComponent {
  services = [
    {
      icon: '/fencing.png',
      title: 'Fencing Installation and Repair',
      points: [
        'High-quality welding for durable fences.',
        'Expert technicians with years of experience.',
        'Custom designs to fit your needs.'
      ]
    },
    {
      icon: '/deck.png',
      title: 'Deck Installation and Repair',
      points: [
        'Repairs for damaged or worn-out fences.',
        'Affordable pricing for repairs.',
        'Same-day service available.'
      ]
    },
    {
      icon: '/siding.png',
      title: 'Siding and Frame Repair',
      points: [
        'Professional siding and frame repair services.',
        'Durable materials for long-lasting results.',
        'Expert craftsmanship with attention to detail.'
      ]
    },
    {
      icon: '/gate.png',
      title: 'Gate Installation and Repair',
      points: [
        'Professional gate installation services.',
        'Wide range of gate styles available.',
        'Quick turnaround times.'
      ]
    },
  ];
  
}
