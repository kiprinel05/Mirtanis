import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { FooterComponent } from './shared/components/footer.component';
import { LoaderComponent } from './shared/components/loader.component';
import { SmoothScrollDirective } from './shared/directives/smooth-scroll.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    LoaderComponent,
    SmoothScrollDirective
  ],
  template: `
    <app-loader />
    <app-navbar />
    <main appSmoothScroll class="min-h-screen">
      <router-outlet />
    </main>
    <app-footer />
  `
})
export class AppComponent {}
