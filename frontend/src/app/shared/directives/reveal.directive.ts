import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

type RevealMode = '' | 'up' | 'left' | 'right' | 'scale';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private rafId = 0;

  @Input() appReveal: RevealMode = '';
  @Input() revealDelay = 0;
  @Input() revealDuration = 1100;

  ngOnInit(): void {
    const node = this.el.nativeElement;

    // Hide the element BEFORE first paint (ngOnInit runs in the same CD tick as element creation).
    const transition =
      `opacity ${this.revealDuration}ms cubic-bezier(0.16,1,0.3,1) ${this.revealDelay}ms,` +
      `transform ${this.revealDuration}ms cubic-bezier(0.16,1,0.3,1) ${this.revealDelay}ms`;
    node.style.opacity = '0';
    node.style.transform = this.initialTransform();
    node.style.transition = transition;
    node.style.willChange = 'opacity, transform';

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      this.show();
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.show();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.show();
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    this.observer.observe(node);
  }

  private initialTransform(): string {
    switch (this.appReveal) {
      case 'left':  return 'translate3d(-48px, 0, 0)';
      case 'right': return 'translate3d(48px, 0, 0)';
      case 'scale': return 'scale(0.92)';
      default:      return 'translate3d(0, 48px, 0)';
    }
  }

  /** Defer the "visible" state by two frames so the browser actually paints the hidden state first. */
  private show(): void {
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {
      this.rafId = requestAnimationFrame(() => {
        const node = this.el.nativeElement;
        node.style.opacity = '1';
        node.style.transform = 'translate3d(0, 0, 0) scale(1)';
      });
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.observer?.disconnect();
  }
}
