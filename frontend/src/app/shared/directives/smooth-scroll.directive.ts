import { AfterViewInit, Directive, OnDestroy } from '@angular/core';

@Directive({ selector: '[appSmoothScroll]', standalone: true })
export class SmoothScrollDirective implements AfterViewInit, OnDestroy {
  private rafId = 0;
  private lenis: any;

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    try {
      const { default: Lenis } = await import('lenis');
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });
      const raf = (time: number) => {
        this.lenis?.raf(time);
        this.rafId = requestAnimationFrame(raf);
      };
      this.rafId = requestAnimationFrame(raf);
    } catch {
      // fallback: native smooth scrolling already on html
    }
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.lenis?.destroy();
  }
}
