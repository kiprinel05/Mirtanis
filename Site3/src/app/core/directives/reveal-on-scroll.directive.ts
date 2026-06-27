import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  AfterViewInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoaderService } from '../services/loader.service';

/**
 * Reveal-on-scroll.
 *
 * The element's hidden initial state is declared in CSS via the
 * `[fbreveal]` attribute selector — so the very first paint already
 * renders the element invisible. This directive then ONLY toggles the
 * `.is-visible` class once the element enters the viewport, allowing
 * the CSS transition to play cleanly.
 */
@Directive({
  selector: '[fbReveal]',
  standalone: true,
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  @Input() fbReveal: 'fade' | 'stagger' = 'fade';
  @Input() threshold = 0.08;
  @Input() rootMargin = '0px 0px -6% 0px';
  @Input() once = true;

  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly loader = inject(LoaderService);
  private observer: IntersectionObserver | null = null;
  private loaderPoll: ReturnType<typeof setInterval> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.elRef.nativeElement;

    // Belt-and-suspenders: also ensure the attribute is present
    // (Angular template `fbReveal="fade"` already does this in HTML,
    // but property bindings like `[fbReveal]` would not).
    if (!el.hasAttribute('fbreveal')) {
      el.setAttribute('fbreveal', this.fbReveal);
    }

    const start = () => {
      // If the element is ALREADY in the viewport when we begin observing
      // (typical for above-the-fold sections right after the loader),
      // schedule reveal via double rAF so the browser paints the initial
      // hidden state at least once before is-visible kicks in.
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  target.classList.add('is-visible');
                });
              });
              if (this.once) this.observer?.unobserve(entry.target);
            } else if (!this.once) {
              entry.target.classList.remove('is-visible');
            }
          }
        },
        { threshold: this.threshold, rootMargin: this.rootMargin },
      );
      this.observer.observe(el);
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
      }, 60);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.loaderPoll) clearInterval(this.loaderPoll);
  }
}
