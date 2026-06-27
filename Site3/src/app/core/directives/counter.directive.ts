import {
  Directive,
  ElementRef,
  Inject,
  Input,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoaderService } from '../services/loader.service';

@Directive({
  selector: '[fbCounter]',
  standalone: true,
})
export class CounterDirective implements AfterViewInit, OnDestroy {
  @Input() fbCounter = 0;
  @Input() duration = 2200;
  @Input() suffix = '';
  @Input() prefix = '';

  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly loader = inject(LoaderService);
  private started = false;
  private observer: IntersectionObserver | null = null;
  private loaderPoll: ReturnType<typeof setInterval> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Render the start value so reveal looks intentional.
    this.elRef.nativeElement.textContent = `${this.prefix}0${this.suffix}`;

    const start = () => {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !this.started) {
            this.started = true;
            this.animate();
            this.observer?.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      this.observer.observe(this.elRef.nativeElement);
    };

    if (!this.loader.isLoading()) {
      start();
    } else {
      this.loaderPoll = setInterval(() => {
        if (!this.loader.isLoading()) {
          if (this.loaderPoll) clearInterval(this.loaderPoll);
          this.loaderPoll = null;
          start();
        }
      }, 80);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.loaderPoll) clearInterval(this.loaderPoll);
  }

  private animate(): void {
    const start = performance.now();
    const target = this.fbCounter;
    const el = this.elRef.nativeElement;

    const tick = (t: number) => {
      const elapsed = t - start;
      const p = Math.min(1, elapsed / this.duration);
      const eased = 1 - Math.pow(1 - p, 4);
      const value = Math.round(target * eased);
      el.textContent = `${this.prefix}${value.toLocaleString()}${this.suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
