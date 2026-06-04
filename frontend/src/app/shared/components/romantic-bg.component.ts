import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef,
  NgZone, OnDestroy, computed, inject, viewChild
} from '@angular/core';
import { PerformanceService } from '../../core/services/performance.service';

/**
 * Animated white–blush backdrop + drifting pink petals.
 *
 * Performance-aware:
 *  - HIGH   → full petal count + scroll parallax on the layers.
 *  - MEDIUM → ~half the petals, no parallax (static layers).
 *  - LOW / reduced-motion → static gradient only, zero animated elements,
 *    and the scroll listener is never attached.
 */
@Component({
  selector: 'app-romantic-bg',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- gradient + two soft aurora blobs (the gradient itself is in CSS) -->
    <div class="romance-bg" aria-hidden="true">
      <div #blobs class="romance-bg__blob romance-bg__blob--1"></div>
      <div class="romance-bg__blob romance-bg__blob--2"></div>
    </div>

    @if (petals().length) {
      <div #field class="petal-field" aria-hidden="true">
        @for (p of petals(); track p.id) {
          <span class="petal-pink"
                [style.left.%]="p.l"
                [style.--w]="p.w"
                [style.--h]="p.h"
                [style.--dur]="p.dur"
                [style.--delay]="p.delay"
                [style.--o]="p.o"
                [style.--c]="p.c"></span>
        }
      </div>
    }
  `
})
export class RomanticBgComponent implements AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly perf = inject(PerformanceService);
  private readonly field = viewChild<ElementRef<HTMLElement>>('field');
  private readonly blobs = viewChild<ElementRef<HTMLElement>>('blobs');

  private ticking = false;
  private lastY = -1;

  private readonly colors = [
    'rgba(216,165,147,.6)',
    'rgba(231,194,182,.55)',
    'rgba(244,222,215,.7)',
    'rgba(233,209,153,.45)'
  ];

  /** Petal count scales with the detected tier (16 high, 8 medium, 0 low). */
  readonly petals = computed(() => {
    const count = this.perf.scaleCount(16);
    return Array.from({ length: count }, (_, id) => {
      const dur = +(9 + Math.random() * 9).toFixed(1);
      return {
        id,
        l: +(Math.random() * 100).toFixed(1),
        w: Math.round(10 + Math.random() * 12) + 'px',
        h: Math.round(8 + Math.random() * 10) + 'px',
        dur: dur + 's',
        delay: +(-Math.random() * dur).toFixed(1) + 's',
        o: +(0.45 + Math.random() * 0.4).toFixed(2),
        c: this.colors[Math.floor(Math.random() * this.colors.length)]
      };
    });
  });

  private readonly onScroll = () => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y !== this.lastY) {
        this.lastY = y;
        const f = this.field()?.nativeElement;
        if (f) f.style.transform = `translate3d(0, ${(-this.bounded(y, 0.18, 130)).toFixed(0)}px, 0)`;
        const b = this.blobs()?.nativeElement?.parentElement;
        if (b) b.style.transform = `translate3d(0, ${this.bounded(y, 0.07, 70).toFixed(0)}px, 0)`;
      }
      this.ticking = false;
    });
  };

  private bounded(y: number, factor: number, max: number): number {
    return max * Math.tanh((y * factor) / max);
  }

  ngAfterViewInit(): void {
    // Parallax only on HIGH. MEDIUM keeps the petals but leaves the layers
    // static — cheaper, still pretty.
    if (typeof window === 'undefined') return;
    if (!this.perf.isHigh()) return;
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }
}
