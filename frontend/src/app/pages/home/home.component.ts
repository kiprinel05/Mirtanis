import { Component } from '@angular/core';
import { HeroSectionComponent } from './sections/hero-section.component';
import { StorySectionComponent } from './sections/story-section.component';
import { ServicesSectionComponent } from './sections/services-section.component';
import { LocationsSectionComponent } from './sections/locations-section.component';
import { LakeSectionComponent } from './sections/lake-section.component';
import { GalleryPreviewComponent } from './sections/gallery-preview.component';
import { TestimonialsSectionComponent } from './sections/testimonials-section.component';
import { FaqSectionComponent } from './sections/faq-section.component';
import { CtaSectionComponent } from './sections/cta-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    StorySectionComponent,
    ServicesSectionComponent,
    LocationsSectionComponent,
    LakeSectionComponent,
    GalleryPreviewComponent,
    TestimonialsSectionComponent,
    FaqSectionComponent,
    CtaSectionComponent
  ],
  template: `
    <app-hero-section />
    <app-story-section />
    <app-services-section />
    <app-locations-section />
    <app-lake-section />
    <app-gallery-preview />
    <app-testimonials-section />
    <app-faq-section />
    <app-cta-section />
  `
})
export class HomeComponent {}
