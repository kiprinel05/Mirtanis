import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

type RevealMode = '' | 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur';

/**
 * Scroll-reveal directive (IntersectionObserver based, GPU-friendly).
 *
 * Usage:
 *   <div appReveal></div>                            // fade-up (default)
 *   <div appReveal="left"></div>                     // slide from left
 *   <div appReveal [revealDelay]="200"></div>
 *   <ul appReveal="up" [revealStagger]="90">…</ul>   // stagger DIRECT children
 *
 * Runs in ngAfterViewInit so @for-generated children already exist when we
 * collect them for staggering.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private rafId = 0;

  @Input() appReveal: RevealMode = '';
  @Input() revealDelay = 0;
  @Input() revealDuration = 1000;
  /** When > 0, animate direct children sequentially instead of the host as a whole. */
  @Input() revealStagger = 0;

  ngAfterViewInit(): void {
    const host = this.el.nativeElement;
    const targets = this.revealStagger > 0
      ? (Array.from(host.children) as HTMLElement[])
      : [host];

    targets.forEach((node, i) => {
      node.style.opacity = '0';
      node.style.transform = this.initialTransform();
      if (this.appReveal === 'blur') node.style.filter = 'blur(10px)';
      const delay = this.revealDelay + i * this.revealStagger;
      node.style.transition =
        `opacity ${this.revealDuration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms,` +
        `transform ${this.revealDuration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms,` +
        `filter ${this.revealDuration}ms ease ${delay}ms`;
      node.style.willChange = 'opacity, transform';
    });

    if (typeof IntersectionObserver === 'undefined') {
      this.show(targets);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.show(targets);
            this.observer?.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    this.observer.observe(host);
  }

  private initialTransform(): string {
    switch (this.appReveal) {
      case 'left':  return 'translate3d(-52px, 0, 0)';
      case 'right': return 'translate3d(52px, 0, 0)';
      case 'down':  return 'translate3d(0, -44px, 0)';
      case 'scale': return 'scale(0.9)';
      case 'blur':  return 'translate3d(0, 28px, 0)';
      default:      return 'translate3d(0, 52px, 0)';
    }
  }

  private show(targets: HTMLElement[]): void {
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {
      this.rafId = requestAnimationFrame(() => {
        for (const node of targets) {
          node.style.opacity = '1';
          node.style.transform = 'translate3d(0,0,0) scale(1)';
          node.style.filter = 'none';
        }
        // Drop will-change once the entrance is done so it doesn't pin layers.
        const total = this.revealDuration + this.revealDelay + targets.length * this.revealStagger + 80;
        setTimeout(() => targets.forEach((n) => (n.style.willChange = 'auto')), total);
      });
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.observer?.disconnect();
  }
}
