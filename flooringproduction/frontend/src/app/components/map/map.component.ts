import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private map: any;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Coordinates for Nandigaon, Telangana
    const location: L.LatLngExpression = [17.5078138, 78.1992774];
    const zoomLevel = 15;

    // Create map
    this.map = L.map(this.mapContainer.nativeElement).setView(location, zoomLevel);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Add marker
    const marker = L.marker(location, {
      title: 'Nandigaon Location',
      alt: 'Nandigaon, Telangana',
      riseOnHover: true
    }).addTo(this.map);

    // Add popup to marker
    marker.bindPopup('<b>Nandigaon, Telangana</b>').openPopup();
  }
}