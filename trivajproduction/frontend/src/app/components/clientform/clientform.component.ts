import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientformService } from '../../services/clientform.service';

@Component({
  selector: 'app-clientform',
  standalone: true,  // Mark as standalone component
  templateUrl: './clientform.component.html',
  styleUrls: ['./clientform.component.css'],
  imports:[ReactiveFormsModule]
})
export class ClientformComponent {
  clientForm: FormGroup;
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private clientFormService: ClientformService) {
    this.clientForm = this.fb.group({
      businessName: ['', Validators.required],
      businessDescription: ['', Validators.required],
      targetAudience: ['', Validators.required],
      mainGoal: ['', Validators.required],
      sellProducts: ['', Validators.required],
      visitorActions: [''],
      brandStyle: [''],
      preferredWebsites: [''],
      designPreferences: [''],
      selectDesign:[''],
      layout: ['Single Page'],
      contentType: ['', Validators.required],
      contentReady: ['', Validators.required],
      contentHelp: ['', Validators.required],
      highQualityImages: ['', Validators.required],
      requiredFeatures: [''],
      integrationsNeeded: [''],
      specialFunctionality: ['No'],
      seoOptimization: ['No'],
      googleAnalytics: ['No'],
      domainName: ['No'],
      hostingRecommendations: ['No'],
      preferredCMS: [''],
      timeline: ['', Validators.required],
      budget: ['', Validators.required],
      ongoingMaintenance: ['No'],
      futureUpdates: ['No'],
      competitors: [''],
      differentiation: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }
  
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
  
    // Trim whitespace from all string inputs before submitting
    let formData = { ...this.clientForm.value };
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === 'string') {
        formData[key] = formData[key].trim();
      }
    });
  
    console.log('✅ Sending Data:', formData);
  
    this.clientFormService.submitClientForm(formData).subscribe({
      next: (response) => {
        console.log('✅ Success:', response);
        this.successMessage = 'Form submitted successfully!';
        this.isSubmitting = false;
        alert('Form submitted, Congratulations ✅');

  
        // Reset form but keep default values
        this.clientForm.reset({
          layout: 'Single Page',
          specialFunctionality: 'No',
          seoOptimization: 'No',
          googleAnalytics: 'No',
          hostingRecommendations: 'No',
          ongoingMaintenance: 'No',
          futureUpdates: 'No',
        });
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.errorMessage = 'Failed to submit form. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
  
}
