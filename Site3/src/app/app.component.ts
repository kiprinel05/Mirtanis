import {
  Component,
  ChangeDetectionStrategy,
  inject,
  HostListener,
  PLATFORM_ID,
  Inject,
  AfterViewInit,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LoadingScreenComponent } from './shared/components/loading-screen/loading-screen.component';
import { ScrollProgressComponent } from './shared/components/scroll-progress/scroll-progress.component';
import { CustomCursorComponent } from './shared/components/custom-cursor/custom-cursor.component';
import { FloatingCtaComponent } from './shared/components/floating-cta/floating-cta.component';

import { ScrollService } from './core/services/scroll.service';
import { LoaderService } from './core/services/loader.service';

@Component({
  selector: 'fb-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    LoadingScreenComponent,
    ScrollProgressComponent,
    CustomCursorComponent,
    FloatingCtaComponent,
  ],
  template: `
    @if (showShell()) {
      <fb-loading-screen />
      <fb-scroll-progress />
      <fb-custom-cursor />
      <div class="cursor-glow" aria-hidden="true"></div>
      <fb-navbar />
    }

    <main id="main" class="relative overflow-hidden">
      <router-outlet />
    </main>

    @if (showShell()) {
      <fb-footer />
      <fb-floating-cta />
    }
  `,
})
export class AppComponent implements AfterViewInit {
  private readonly scrollService = inject(ScrollService);
  private readonly loaderService = inject(LoaderService);
  private readonly router = inject(Router);

  /** Hide the presentation-site chrome on /gallery/* and /admin/*. */
  private readonly currentUrl = signal(this.router.url);
  protected readonly showShell = computed(() => {
    const url = this.currentUrl();
    return !url.startsWith('/gallery') && !url.startsWith('/admin');
  });

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.currentUrl.set(e.urlAfterRedirects));
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollService.initSmoothScroll();
      this.loaderService.complete(900);
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.documentElement.style.setProperty(
      '--cursor-x',
      `${event.clientX}px`,
    );
    document.documentElement.style.setProperty(
      '--cursor-y',
      `${event.clientY}px`,
    );
  }
}
