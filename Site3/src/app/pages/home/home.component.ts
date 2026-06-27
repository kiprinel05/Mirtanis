import { Component, ChangeDetectionStrategy } from '@angular/core';

import { HeroComponent } from './sections/hero/hero.component';
import { ServicesComponent } from './sections/services/services.component';
import { PortfolioComponent } from './sections/portfolio/portfolio.component';
import { WhyUsComponent } from './sections/why-us/why-us.component';
import { StorytellingComponent } from './sections/storytelling/storytelling.component';
import { TestimonialsComponent } from './sections/testimonials/testimonials.component';
import { BeforeAfterComponent } from './sections/before-after/before-after.component';
import { BlogComponent } from './sections/blog/blog.component';
import { FacebookComponent } from './sections/facebook/facebook.component';
import { ContactComponent } from './sections/contact/contact.component';

@Component({
  selector: 'fb-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroComponent,
    ServicesComponent,
    PortfolioComponent,
    WhyUsComponent,
    StorytellingComponent,
    TestimonialsComponent,
    BeforeAfterComponent,
    BlogComponent,
    FacebookComponent,
    ContactComponent,
  ],
  template: `
    <fb-hero />
    <fb-services />
    <fb-portfolio />
    <fb-why-us />
    <fb-storytelling />
    <fb-testimonials />
    <fb-before-after />
    <fb-blog />
    <fb-facebook />
    <fb-contact />
  `,
})
export class HomeComponent {}
