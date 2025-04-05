import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginSignupComponent } from '../login-signup/login-signup.component';

interface Feature {
  title: string;
}

interface Package {
  title: string;
  price: string;
  period: string;
  description: string;
  oldPrice:string;
  features: Feature[];
}

@Component({
  selector: 'app-pricing',
  imports: [CommonModule,LoginSignupComponent],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],


})
export class PricingComponent {

  isSignUpFormVisible = false;


  // constructor(private router: Router) {}

  packages: Package[] = [
    {
      title: 'Startup  Bundle ',
      oldPrice: '$597',  // Old price
      price: '$179',
      period: '/month',
      description: 'Get online fast with a sleek, professional website! Perfect for startups and small businesses looking to establish a strong digital presence.',
      features: [
        { title: 'Custom 3-Page Website' },
        { title: '3 Eye-Catching Banner Creations' },
        { title: '5 Premium Stock Images' },
        { title: 'Dynamic jQuery Slider' },
        { title: 'SEO-Optimized Sitemap (FREE)' },
        { title: 'W3C-Compliant, Clean HTML Code' },
        { title: 'Super-Fast Delivery (48-72 Hours)' },
        { title: 'Branded Social Media Graphics (Facebook, Twitter, YouTube)' },
        { title: '100% Satisfaction Guarantee' },
        { title: 'Original & Exclusive Design Guarantee' },
        { title: 'Risk-Free Full Refund Policy (Terms Apply)' },
        { title: 'Mobile-Friendly Upgrade' },
        { title: 'CMS Add-On' },
    ],
    
    },
    {
      title: 'Elite Corporate Bundle ',
      price: '$379',
      period: '/month',
      description: 'Designed for growing businesses ready to dominate their industry. A powerful online presence tailored for success!',
      oldPrice: '$1263',  // Old price

      features: [
        { title: 'Custom 5-Page Website' },
        { title: 'CMS / Admin Dashboard Included' },
        { title: '8 High-Quality Stock Photos' },
        { title: '5 Custom Banner Designs' },
        { title: 'Interactive jQuery Slider' },
        { title: 'SEO-Optimized Sitemap (FREE)' },
        { title: 'W3C-Compliant, Standard HTML Code' },
        { title: 'Lightning-Fast Turnaround (48-72 Hours)' },
        { title: 'Branded Social Media Covers (Facebook, Twitter, YouTube)' },
        { title: 'Full Website Deployment' },
        { title: 'Guaranteed 100% Satisfaction' },
        { title: 'Exclusive, Custom Design Assurance' },
        { title: 'Risk-Free Money-Back Guarantee (Terms Apply)' },
        { title: 'Mobile-Friendly Upgrade' },
    ],
    
    },
    {
      title: 'High-End Business Solution',
      oldPrice: '$4263',  // Old price
      price: '$1279',
      period: '/month',
      description: 'A premium website for brands that mean business! Crafted for businesses needing advanced features and a stunning online presence.',
      features: [
        { title: '8-10 Page Custom Website' },
        { title: 'Engaging, High-Impact Design' },
        { title: 'Secure Online Payment System' },
        { title: 'Integrated Online Booking Feature' },
        { title: 'User-Friendly CMS' },
        { title: 'Fully Responsive & Mobile-Optimized' },
        { title: 'Custom Inquiry & Lead Generation Forms' },
        { title: 'Eye-Catching Hover Effects' },
        { title: 'Integrated Newsletter Subscription' },
        { title: 'Live Newsfeed Display' },
        { title: 'Seamless Social Media Connectivity' },
        { title: 'SEO-Optimized & Search Engine Submission' },
        { title: 'Branded Social Media Cover Designs' },
        { title: 'Complete Website Setup & Deployment' },
        { title: '100% Custom Design Guarantee' },
        { title: 'Risk-Free Money-Back Guarantee' },
      ],
    },
    {
      title: 'E-Store Web Design Bundle',
      oldPrice: '$4263',  // Old price
      price: '$1279',
      period: '/month',
      description: 'Your online store, built for conversions and success! Perfect for businesses looking to sell products and generate revenue online.',
      features: [
        { title: 'Up to 15 Custom Web Pages' },
        { title: 'Creative & Interactive Design' },
        { title: 'Integrated Content Management System (CMS)' },
        { title: 'Mobile-Optimized for All Devices' },
        { title: 'Effortless Product Search Feature' },
        { title: 'Customer Ratings & Reviews Section' },
        { title: 'Supports Up to 100 Products' },
        { title: 'Unlimited Product Categories & Filters' },
        { title: 'Seamless Shopping Cart & Secure Checkout' },
        { title: 'Sales & Inventory Monitoring Tools' },
        { title: 'Dynamic jQuery Slider' },
        { title: 'Complimentary SEO-Optimized Sitemap' },
        { title: 'Free 1-Year Domain & Hosting' },
        { title: 'Professional Business Email Accounts' },
        { title: 'Branded Social Media Designs' },
        { title: 'Full Website Setup & Launch' },
        { title: '100% Ownership Rights' },
        { title: 'Risk-Free Money-Back Guarantee (T&C Apply)' },
      ],
    },
    

    {
      title: 'Advanced E-Commerce  Package',
      oldPrice: '$5163',  // Old price
      price: '$1549',
      period: '',
      description: 'The ultimate e-commerce solution for brands that want to scale! A high-performance, sales-driven online store with unlimited possibilities.',
      features: [
        { title: 'Tailor-Made, High-Quality Website' },
        { title: 'Unlimited Pages & Product Listings' },
        { title: 'Advanced Product Search & Filtering' },
        { title: 'Seamless Online Payment Processing' },
        { title: 'Smart Inventory & Sales Tracking' },
        { title: 'Dynamic jQuery Slider & Hover Effects' },
        { title: '10 Custom Banners & 10 Stock Images' },
        { title: 'Unlimited Revisions' },
        { title: 'Multi-Language Support' },
        { title: 'Custom Online Forms & Newsletter Signups' },
        { title: 'Built-in Search Function' },
        { title: 'Social Media Feed Integration (Optional)' },
        { title: 'Mobile-Optimized & Fully Responsive' },
        { title: '1-Year Free Hosting & Domain' },
        { title: 'SEO-Optimized Sitemap & Google Submission' },
        { title: 'Complete Website Launch & Personalized Support' },
        { title: '100% Ownership & Control' },
        { title: 'Guaranteed Satisfaction & Risk-Free Money-Back Policy' },
      ],
    },
    
    {
      title: "Advanced Business Plan",
      oldPrice: "$5329",
      price: "$1599",
      period: "/one-time",
      description: "A feature-rich website designed for businesses that need a powerful online presence with a sleek and high-end design.",
      features: [
        { title: "15 to 20-Page Custom Website" },
        { title: "Tailor-Made, Interactive, and Dynamic Design" },
        { title: "Custom WordPress or PHP Development" },
        { title: "jQuery Slider Banner" },
        { title: "Up to 10 Personalized Banners" },
        { title: "10 Premium Stock Images" },
        { title: "Unlimited Revisions" },
        { title: "Unique Hover Effects" },
        { title: "Content Management System (CMS)" },
        { title: "Appointment Booking, Scheduling, or Online Ordering System" },
        { title: "Secure Online Payment Integration" },
        { title: "Multi-Language Support" },
        { title: "Custom Dynamic Forms" },
        { title: "Newsletter Subscription Section" },
        { title: "Advanced Search Bar" },
        { title: "Live Social Media Feed Integration" },
        { title: "Fully Mobile-Optimized Website" },
        { title: "FREE 5-Year Domain Name" },
        { title: "SEO-Friendly Sitemap (FREE)" },
        { title: "Search Engine Submission" },
        { title: "W3C-Compliant, Clean HTML Code" },
        { title: "Industry-Specific Expert Development Team" },
        { title: "Complete Deployment & Setup" },
        { title: "Dedicated Account Manager" },
        { title: "Custom Facebook, Twitter & YouTube Page Designs" },
        { title: "100% Ownership Rights" },
        { title: "Satisfaction Guarantee" },
        { title: "Exclusive & Unique Design Assurance" },
        { title: "Risk-Free Full Refund Policy (Terms Apply)" }
      ]
    },
    
    
    {
      title: 'Custom Web Portal Solution',
      oldPrice: '$16663',
      price: '$4999',
      period: '/one-time',
      description: 'A high-performance web portal designed for businesses that require custom development, automation tools, and advanced learning features.',
      features: [
        { title: 'Unlimited Page Website' },
        { title: 'Tailor-Made Content Management System (CMS)' },
        { title: 'Exclusive Page Layouts & UI Design' },
        { title: 'Fully Custom Development' },
        { title: 'Automated Workflow & Process Tools' },
        { title: 'Live Newsfeed Integration' },
        { title: 'Built-In Social Media Plugins' },
        { title: 'Up to 40 High-Quality Stock Images' },
        { title: '10 Custom Banner Designs' },
        { title: 'Interactive jQuery Slider' },
        { title: 'SEO Submission' },
        { title: 'Google-Friendly Sitemap (FREE)' },
        { title: 'Complimentary 5-Year Hosting' },
        { title: 'Professional Business Email Addresses' },
        { title: 'Custom Social Media Page Designs' },
        { title: 'W3C-Compliant Code' },
        { title: 'End-to-End Deployment' },
        { title: 'Automated Course Development' },
        { title: 'Live Video Conferencing' },
        { title: 'Skills & Certification Tracking' },
        { title: 'Mobile-Optimized Learning' },
        { title: 'Self-Paced Learning System' },
        { title: 'Integrated CRM Features' },
        { title: 'Gamification Elements' },
        { title: 'Social Collaboration & Discussion Boards' },
        { title: 'Engagement Triggers & Motivational Tools' },
        { title: 'Community Forums & Webinars' },
        { title: 'Subscription & E-Commerce Functionality' },
        { title: 'Online Course Reservations' },
        { title: 'Advanced Reporting & Analytics' },
        { title: 'Integrated Invoicing & Financial Tools' },
        { title: 'Student & User Data Management' },
        { title: 'Automated Notifications & Messaging' },
        { title: 'Learning Management System (LMS)' },
        { title: 'Effortless Course Scheduling' },
        { title: 'Performance Tracking & Live Feedback' },
        { title: 'Digital Gradebook & Assessment Tools' },
        { title: 'Seamless User Integration' },
        { title: 'Multiple Payment Gateway Options' },
        { title: 'Interactive Online Communities' },
        { title: 'Resource Library & Content Curation' },
        { title: '100% Ownership Rights' },
        { title: 'Complete Customer Satisfaction Guarantee' },
        { title: 'Custom & Unique Design Guarantee' },
        { title: 'Risk-Free Full Refund Policy (Terms Apply)' }
      ]
    },

    {
      title: 'Custom Online Store',
      oldPrice: '$23329',
      price: '$6999',
      period: '/one-time',
      description: 'Take your business online with a feature-rich, high-performing e-commerce platform designed to maximize sales, enhance user experience, and streamline operations.',
      features: [
        { title: 'Unlimited Pages & Dynamic Design' },
        { title: 'Online Booking & Payment Integration' },
        { title: 'Content Management System (CMS)' },
        { title: 'Custom & Lead Capturing Forms' },
        { title: 'Interactive Hover Effects & Newsfeed Integration' },
        { title: 'Social Media & SEO Optimization' },
        { title: '5 Stock Photos & 3 Custom Banners' },
        { title: 'jQuery Slider & W3C Certified HTML' },
        { title: 'Super-Fast Delivery (48-72 Hours)' },
        { title: 'Branded Social Media Page Designs' },
        { title: 'Complete Setup & Deployment' },
        { title: '100% Unique & Custom Design' },
        { title: 'Full Satisfaction & Money-Back Guarantee' }
      ]
    }
    
    
  ];

  openSignUpFormAndCloseMenu() {
    this.isSignUpFormVisible = true;
  }

  closeSignUpForm() {
    this.isSignUpFormVisible = false;
  }

  // navigateToLogin() {
  //   this.router.navigate(['/signup']);  // Ensure this path matches your route configuration
  // }
}
