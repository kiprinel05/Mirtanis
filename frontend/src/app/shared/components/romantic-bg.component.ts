import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, inject, viewChild } from '@angular/core';

/**
 * Animated white–blush backdrop + drifting pink petals for the home page.
 * Sits behind all content (fixed, full-viewport). Pure CSS — very light.
 * A light scroll-parallax nudges the petal field so it feels tied to the page.
 */
@Component({
  selector: 'app-romantic-bg',
  standalone: true,
  template: `
    <!-- gradient + aurora blobs + shimmer veil -->
    <div class="romance-bg" aria-hidden="true">
      <div class="romance-bg__veil"></div>
      <div #blobs class="romance-bg__blob romance-bg__blob--1"></div>
      <div class="romance-bg__blob romance-bg__blob--2"></div>
      <div class="romance-bg__blob romance-bg__blob--3"></div>
      <div class="romance-bg__blob romance-bg__blob--4"></div>
    </div>

    <!-- blush petal field -->
    <div #field class="petal-field" aria-hidden="true">
      @for (p of petals; track $index) {
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
  `
})
export class RomanticBgComponent implements AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly field = viewChild<ElementRef<HTMLElement>>('field');
  private readonly blobs = viewChild<ElementRef<HTMLElement>>('blobs');
  private ticking = false;
  private readonly onScroll = () => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      // Smooth, bounded parallax (no wrap → no jump). The fixed layers drift a
      // little with scroll then ease to a max so they never reveal a gap. The
      // petals also keep falling on their own, so motion never feels frozen.
      const f = this.field()?.nativeElement;
      if (f) f.style.transform = `translate3d(0, ${(-this.bounded(y, 0.18, 130)).toFixed(1)}px, 0)`;
      const b = this.blobs()?.nativeElement?.parentElement;
      if (b) b.style.transform = `translate3d(0, ${this.bounded(y, 0.08, 80).toFixed(1)}px, 0)`;
      this.ticking = false;
    });
  };

  /** Scroll * factor, smoothly saturating toward ±max (tanh-style). */
  private bounded(y: number, factor: number, max: number): number {
    return max * Math.tanh((y * factor) / max);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }
  // Palette of soft blush / rose / champagne tones
  private readonly colors = [
    'rgba(216,165,147,.6)',   // blush
    'rgba(231,194,182,.55)',  // light rose
    'rgba(244,222,215,.7)',   // pale petal
    'rgba(213,165,147,.5)',
    'rgba(233,209,153,.45)'   // champagne accent
  ];

  // Values carry their CSS unit so they bind straight onto custom properties.
  readonly petals = Array.from({ length: 34 }, () => {
    const dur = +(9 + Math.random() * 9).toFixed(1);
    return {
      l: +(Math.random() * 100).toFixed(1),
      w: Math.round(10 + Math.random() * 12) + 'px',
      h: Math.round(8 + Math.random() * 10) + 'px',
      dur: dur + 's',
      delay: +(-Math.random() * dur).toFixed(1) + 's', // negative → already mid-fall
      o: +(0.45 + Math.random() * 0.4).toFixed(2),
      c: this.colors[Math.floor(Math.random() * this.colors.length)]
    };
  });

}
