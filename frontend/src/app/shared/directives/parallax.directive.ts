import { AfterViewInit, Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

@Directive({ selector: '[appParallax]', standalone: true })
export class ParallaxDirective implements AfterViewInit {
  private readonly el = inject(ElementRef<HTMLElement>);
  @Input() parallaxFactor = 0.18;

  ngAfterViewInit(): void { this.update(); }

  @HostListener('window:scroll')
  onScroll(): void { this.update(); }

  private update(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const viewportH = window.innerHeight || 1;
    const center = rect.top + rect.height / 2 - viewportH / 2;
    const translateY = -center * this.parallaxFactor;
    this.el.nativeElement.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
  }
}
