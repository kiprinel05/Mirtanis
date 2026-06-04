import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, inject } from '@angular/core';
import { PerformanceService } from '../../core/services/performance.service';

/**
 * Smooth, rAF-batched vertical parallax. Runs entirely OUTSIDE Angular's zone
 * (no change detection on scroll) and is disabled on touch / reduced-motion to
 * keep mobile and low-power devices fast.
 *
 *   <div class="absolute inset-0 overflow-hidden">
 *     <div appParallax [parallaxFactor]="0.18" class="absolute -top-[12%] inset-x-0 h-[124%]">
 *       <img class="..." />
 *     </div>
 *   </div>
 */
@Directive({ selector: '[appParallax]', standalone: true })
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly perf = inject(PerformanceService);
  @Input() parallaxFactor = 0.18;

  private ticking = false;
  private enabled = false;
  private readonly onScroll = () => this.requestTick();

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    // Parallax recomputes layout on scroll → only worth it on capable devices.
    // Skipped on touch and on anything below the HIGH tier (measured FPS).
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (coarse || !this.perf.isHigh()) return;

    this.enabled = true;
    this.el.nativeElement.style.willChange = 'transform';
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
    });
    this.update();
  }

  private requestTick(): void {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => { this.update(); this.ticking = false; });
  }

  private update(): void {
    if (!this.enabled) return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const viewportH = window.innerHeight || 1;
    if (rect.bottom < -200 || rect.top > viewportH + 200) return;
    const center = rect.top + rect.height / 2 - viewportH / 2;
    const translateY = -center * this.parallaxFactor;
    this.el.nativeElement.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  }
}
