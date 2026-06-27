import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  readonly isLoading = signal(true);
  readonly progress = signal(0);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  complete(duration = 900): void {
    const start = performance.now();
    const tick = (t: number) => {
      const elapsed = t - start;
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      this.progress.set(Math.round(eased * 100));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        // Match the CSS opacity transition duration of the loading screen.
        setTimeout(() => {
          this.isLoading.set(false);
          if (isPlatformBrowser(this.platformId)) {
            document.documentElement.classList.add('app-ready');
          }
        }, 650);
      }
    };
    requestAnimationFrame(tick);
  }
}
