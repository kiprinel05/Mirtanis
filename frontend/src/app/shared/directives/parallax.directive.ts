import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

/**
 * Smooth, rAF-batched vertical parallax.
 *
 * Apply it to a WRAPPER element (not directly on images that already animate
 * with ken-burns/hover) so transforms don't collide. The wrapper should be a
 * bit taller than its container (e.g. -top-[12%] h-[124%]) so the translate
 * never reveals an edge.
 *
 *   <div class="absolute inset-0 overflow-hidden">
 *     <div appParallax [parallaxFactor]="0.18" class="absolute -top-[12%] inset-x-0 h-[124%]">
 *       <img class="animate-ken-burns ..." />
 *     </div>
 *   </div>
 */
@Directive({ selector: '[appParallax]', standalone: true })
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  /** Positive = element drifts opposite to scroll (classic parallax). */
  @Input() parallaxFactor = 0.18;

  private ticking = false;
  private readonly onScroll = () => this.requestTick();

  ngAfterViewInit(): void {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onScroll, { passive: true });
    this.update();
  }

  private requestTick(): void {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => { this.update(); this.ticking = false; });
  }

  private update(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const viewportH = window.innerHeight || 1;
    // Only compute while roughly on-screen.
    if (rect.bottom < -200 || rect.top > viewportH + 200) return;
    const center = rect.top + rect.height / 2 - viewportH / 2;
    const translateY = -center * this.parallaxFactor;
    this.el.nativeElement.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
    this.el.nativeElement.style.willChange = 'transform';
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  }
}
