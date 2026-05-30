import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from './sections/hero-section.component';
import { StorySectionComponent } from './sections/story-section.component';
import { LocationsSectionComponent } from './sections/locations-section.component';
import { LakeSectionComponent } from './sections/lake-section.component';
import { TestimonialsSectionComponent } from './sections/testimonials-section.component';
import { CtaSectionComponent } from './sections/cta-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    StorySectionComponent,
    LocationsSectionComponent,
    LakeSectionComponent,
    TestimonialsSectionComponent,
    CtaSectionComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero-section />
    <app-story-section />
    <app-locations-section />
    <app-lake-section />
    <app-testimonials-section />
    <app-cta-section />
  `
})
export class HomeComponent {}
