import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { FooterComponent } from './shared/components/footer.component';
import { LoaderComponent } from './shared/components/loader.component';
import { SmoothScrollDirective } from './shared/directives/smooth-scroll.directive';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    LoaderComponent,
    SmoothScrollDirective,
    ComingSoonComponent
  ],
  template: `
    @if (comingSoon) {
      <!-- Maintenance gate shown while the site is being prepared on the server -->
      <app-coming-soon />
    } @else {
      <app-loader />
      <app-navbar />
      <main appSmoothScroll class="min-h-screen">
        <router-outlet />
      </main>
      <app-footer />
    }
  `
})
export class AppComponent {
  readonly comingSoon = environment.comingSoon;
}
