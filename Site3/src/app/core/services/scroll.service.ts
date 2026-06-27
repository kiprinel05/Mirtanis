import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Lenis from '@studio-freight/lenis';

/**
 * Smooth-scroll + scroll progress service.
 * Wraps Lenis for cinematic inertia scrolling and exposes
 * scrollY / progress signals consumed across the UI.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  readonly scrollY = signal(0);
  readonly progress = signal(0);

  private lenis: Lenis | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  initSmoothScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    this.lenis = new Lenis({
      // Quicker, snappier easing when reduced-motion is requested,
      // but still smooth — the site's identity is smooth scroll.
      duration: reduce ? 0.6 : 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    const raf = (time: number) => {
      this.lenis?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    this.lenis.on('scroll', (e: { scroll: number }) => {
      this.scrollY.set(e.scroll);
      this.updateProgress();
    });

    window.addEventListener('resize', this.updateProgress, { passive: true });
    this.updateProgress();
  }

  private onNativeScroll = (): void => {
    this.scrollY.set(window.scrollY);
    this.updateProgress();
  };

  private updateProgress = (): void => {
    if (!isPlatformBrowser(this.platformId)) return;
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const y = this.scrollY();
    const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    this.progress.set(p);
  };

  scrollTo(target: string | number, offset = 0): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.lenis) {
      if (typeof target === 'number') {
        this.lenis.scrollTo(target, { offset });
      } else {
        this.lenis.scrollTo(target, { offset });
      }
      return;
    }

    let y = 0;
    if (typeof target === 'number') {
      y = target;
    } else {
      const el = document.querySelector(target) as HTMLElement | null;
      if (!el) return;
      y = el.getBoundingClientRect().top + window.scrollY + offset;
    }
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  /** Pause Lenis (e.g. when a modal/menu is open). */
  stop(): void {
    this.lenis?.stop();
  }
  start(): void {
    this.lenis?.start();
  }
}
