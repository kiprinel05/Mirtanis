import { Directive } from '@angular/core';

/**
 * Smooth scrolling is handled natively via `scroll-behavior: smooth` (see styles.scss)
 * which respects `prefers-reduced-motion`. This directive is kept as a lightweight,
 * dependency-free anchor so the app shell can opt-in without pulling an external lib.
 */
@Directive({
  selector: '[appSmoothScroll]',
  standalone: true
})
export class SmoothScrollDirective {}
