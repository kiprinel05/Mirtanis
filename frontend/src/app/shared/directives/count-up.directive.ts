import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

/**
 * Counts a number up from 0 to [countUp] when it scrolls into view.
 * Preserves an optional prefix/suffix (e.g. "+", "%").
 *
 *   <span [countUp]="300" countSuffix="+"></span>
 */
@Directive({
  selector: '[countUp]',
  standalone: true
})
export class CountUpDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private rafId = 0;
  private done = false;

  @Input({ required: true }) countUp = 0;
  @Input() countDuration = 1600;
  @Input() countPrefix = '';
  @Input() countSuffix = '';

  ngAfterViewInit(): void {
    this.el.nativeElement.textContent = `${this.countPrefix}0${this.countSuffix}`;
    if (typeof IntersectionObserver === 'undefined') { this.run(); return; }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !this.done) { this.done = true; this.run(); this.observer?.disconnect(); }
        }
      },
      { threshold: 0.4 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  private run(): void {
    const start = performance.now();
    const target = this.countUp;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / this.countDuration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const val = Math.round(target * eased);
      this.el.nativeElement.textContent = `${this.countPrefix}${val}${this.countSuffix}`;
      if (p < 1) this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.observer?.disconnect();
  }
}
