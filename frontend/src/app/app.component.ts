import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
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
    } @else if (chromeless()) {
      <!-- Admin area: standalone, no public navbar/footer -->
      <router-outlet />
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
  private readonly router = inject(Router);
  readonly comingSoon = environment.comingSoon;
  readonly chromeless = signal(this.isAdmin(this.router.url));

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.chromeless.set(this.isAdmin(e.urlAfterRedirects)));
  }

  private isAdmin(url: string): boolean {
    return url.startsWith('/admin');
  }
}
