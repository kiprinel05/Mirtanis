import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[fbParallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit, OnDestroy {
  @Input() fbParallax = 0.3;

  private readonly elRef = inject(ElementRef<HTMLElement>);
  private ticking = false;
  private rafId: number | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.elRef.nativeElement.style.willChange = 'transform';
    this.schedule();
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.schedule();
  }

  private schedule(): void {
    if (this.ticking) return;
    this.ticking = true;
    this.rafId = requestAnimationFrame(() => {
      this.update();
      this.ticking = false;
    });
  }

  private update(): void {
    const el = this.elRef.nativeElement;
    const rect = el.getBoundingClientRect();
    const wh = window.innerHeight;
    if (rect.bottom < 0 || rect.top > wh) return;
    const offset = (rect.top - wh / 2) * this.fbParallax;
    el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  }
}
