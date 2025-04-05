import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements AfterViewInit, OnInit, OnDestroy {
  images = [
    { id: 'T0001', src: '/designs/Decks.png', alt: 'Project 1' },
    { id: 'T0002', src: '/designs/acAndHeating.jpg', alt: 'Project 2' },
    { id: 'T0003', src: '/designs/bathroom.png', alt: 'Project 3' },
    { id: 'T0004', src: '/designs/Electrician.jpg', alt: 'Project 4' },
    { id: 'T0005', src: '/designs/Fencing.jpg', alt: 'Project 5' },
    { id: 'T0006', src: '/designs/Flooring.jpg', alt: 'Project 6' },
    { id: 'T0007', src: '/designs/garageDoors.jpg', alt: 'Project 7' },
    { id: 'T0008', src: '/designs/Kitchen.jpg', alt: 'Project 8' },
    { id: 'T0009', src: '/designs/lawnMover.png', alt: 'Project 9' },
    { id: 'T0010', src: '/designs/pest.jpg', alt: 'Project 10' },
    { id: 'T0011', src: '/designs/Plumbing.jpg', alt: 'Project 11' },
    { id: 'T0012', src: '/designs/roofing.png', alt: 'Project 12' },
  ];

  selectedImage: { src: string; alt: string } | null = null;
  isModalOpen = false;
  zoomLevel = 1;
  zoomStep = 0.2;
  maxZoomLevel = 4;
  minZoomLevel = 1;
  isDragging = false;
  initialMousePosition = { x: 0, y: 0 };
  imagePosition = { x: 0, y: 0 };
  zoomOrigin = { x: 50, y: 50 }; // Default zoom origin (center of the image)

  ngAfterViewInit(): void {
    this.lazyLoadImages(); // Lazy load images after the view is initialized
  }

  ngOnInit(): void {
    // Add event listener for keydown events (for arrow keys)
    window.addEventListener('keydown', this.handleArrowKeys.bind(this));

    // Add mouse wheel event listener for zoom functionality
    window.addEventListener('wheel', this.handleMouseWheel.bind(this), { passive: true });
  }

  ngOnDestroy(): void {
    // Clean up event listeners when the component is destroyed
    window.removeEventListener('keydown', this.handleArrowKeys.bind(this));
    window.removeEventListener('wheel', this.handleMouseWheel.bind(this));
  }


    // Next image functionality
    nextImage(): void {
      const currentIndex = this.images.findIndex((img) => img.src === this.selectedImage?.src);
      const nextIndex = (currentIndex + 1) % this.images.length; // Loop back to the first image
      this.selectedImage = this.images[nextIndex];
      this.resetZoom(); // Reset zoom and position
    }
  
    // Navigate to previous image
    previousImage(): void {
      const currentIndex = this.images.findIndex((img) => img.src === this.selectedImage?.src);
      const prevIndex = (currentIndex - 1 + this.images.length) % this.images.length; // Loop back to the last image
      this.selectedImage = this.images[prevIndex];
      this.resetZoom(); // Reset zoom and position
    }
  

  // Handle arrow key navigation
  handleArrowKeys(event: KeyboardEvent): void {
    if (this.isModalOpen) {
      if (event.key === 'ArrowLeft') {
        this.previousImage();
      } else if (event.key === 'ArrowRight') {
        this.nextImage();
      }
    }
  }

  // Handle mouse wheel zooming with more precise zoom behavior
  handleMouseWheel(event: WheelEvent): void {
    if (this.isModalOpen) {
      event.preventDefault();
      event.stopPropagation();
      if (event.deltaY < 0) {
        this.zoomIn(event);
      } else if (event.deltaY > 0) {
        this.zoomOut();
      }
    }
  }
  



  // Lazy loading functionality
  lazyLoadImages(): void {
    const images = document.querySelectorAll('img.lazy-image');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.getAttribute('data-src')!;
          observer.unobserve(img); // Stop observing once the image has been loaded
        }
      });
    });

    images.forEach((img) => {
      observer.observe(img); // Start observing each image
    });
  }

  // Open modal functionality
  openModal(image: { src: string; alt: string }): void {
    this.selectedImage = image;
    this.isModalOpen = true;
    this.zoomLevel = 1;
    this.imagePosition = { x: 0, y: 0 };
    this.zoomOrigin = { x: 50, y: 50 }; // Reset to the center zoom origin
  
    // Disable background scrolling
    document.body.classList.add('no-scroll');
  }


  zoomIn(event: WheelEvent): void {
    if (this.zoomLevel < this.maxZoomLevel) {
      this.zoomLevel += this.zoomStep;
      this.updateZoom(event);  // Update the zoom based on mouse position
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > this.minZoomLevel) {
      this.zoomLevel -= this.zoomStep;
      // Calling updateZoom without the event argument since it's zooming out
      this.updateZoom();
    }
  }

  // Close modal functionality
  closeModal(): void {
    this.selectedImage = null;
    this.isModalOpen = false;
  
    // Enable background scrolling
    document.body.classList.remove('no-scroll');
  }


  // Get style for the image wrapper for dynamic adjustments
  getImageStyle() {
    return {
      transform: `translate(${this.imagePosition.x}px, ${this.imagePosition.y}px) scale(${this.zoomLevel})`,
      transformOrigin: `${this.zoomOrigin.x}% ${this.zoomOrigin.y}%`, // Adjust transform-origin dynamically
    };
  }

  // Handle image drag functionality
  onMouseDown(event: MouseEvent): void {
    if (this.zoomLevel > 1) {  // Allow drag only when zoomed in
      this.isDragging = true;
      this.initialMousePosition = { x: event.clientX, y: event.clientY };
      document.addEventListener('mousemove', this.onMouseMove.bind(this));
      document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }
  }

  // Handle mousemove event for dragging
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging && this.selectedImage) {
      const deltaX = event.clientX - this.initialMousePosition.x;
      const deltaY = event.clientY - this.initialMousePosition.y;

      const imageElement = document.querySelector('.modal-image') as HTMLImageElement;
      if (imageElement) {
        const rect = imageElement.getBoundingClientRect();

        // Calculate boundaries for dragging, taking zoom into account
        const maxOffsetX = (rect.width * this.zoomLevel - rect.width) / 2;
        const maxOffsetY = (rect.height * this.zoomLevel - rect.height) / 2;

        // Update image position within boundaries
        this.imagePosition.x = Math.max(-maxOffsetX, Math.min(maxOffsetX, this.imagePosition.x + deltaX));
        this.imagePosition.y = Math.max(-maxOffsetY, Math.min(maxOffsetY, this.imagePosition.y + deltaY));

        this.initialMousePosition = { x: event.clientX, y: event.clientY };
      }
    }
  }

  // Stop dragging when mouse is released
  onMouseUp(): void {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }


  
  // Handle double-click to zoom
  zoomOnDoubleClick(event: MouseEvent): void {
    // Calculate the mouse position relative to the image
    const imageElement = event.target as HTMLImageElement;
    const rect = imageElement.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    // Toggle zoom level
    if (this.zoomLevel === 1) {
      this.zoomLevel = 2; // Zoom in
    } else {
      this.zoomLevel = 1; // Zoom out
    }

    // Set the transform origin to the click position (center the zoom on the click location)
    this.zoomOrigin = {
      x: (offsetX / rect.width) * 100,
      y: (offsetY / rect.height) * 100,
    };
 
    this.updateZoom();
  }

  // Update the zoom transformation
  updateZoom(event?: WheelEvent): void {
    const imageElement = document.querySelector('.modal-image') as HTMLImageElement;
    if (imageElement) {
      if (event) {
        const rect = imageElement.getBoundingClientRect();
        
        // Calculate mouse position relative to the image
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        // Update the zoom origin to the mouse position
        this.zoomOrigin = {
          x: (offsetX / rect.width) * 100,
          y: (offsetY / rect.height) * 100,
        };
      }

      // Apply the zoom and set the transform origin dynamically
      imageElement.style.transform = `translate(-50%, -50%) scale(${this.zoomLevel})`;
      imageElement.style.transformOrigin = `${this.zoomOrigin.x}% ${this.zoomOrigin.y}%`;  // Dynamic zoom origin
      imageElement.style.transition = 'transform 0.1s ease-in-out'; // Smooth zoom effect
    }
  }

  // Prevent context menu (right-click)
  preventContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }


  resetZoom(): void {
    this.zoomLevel = 1;
    this.imagePosition = { x: 0, y: 0 };
    this.zoomOrigin = { x: 50, y: 25 }; // Reset to center
    const imageElement = document.querySelector('.modal-image') as HTMLImageElement;
    if (imageElement) {
      imageElement.style.setProperty('--zoom-level', '1');
      imageElement.classList.remove('zoomed'); // Remove zoomed class
      imageElement.style.transform = 'translate(0, 0) scale(1)';
    }
  }

  // Handle image error
  handleImageError(image: { src: string; alt: string }): void {
    console.error(`Image failed to load: ${image.src}`);
    image.src = '/path/to/placeholder/image.png'; // Use a valid placeholder URL
  }
}
