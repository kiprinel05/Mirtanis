import { Directive, ElementRef, HostListener, Input, NgZone, inject } from '@angular/core';

/**
 * Subtle 3D tilt on pointer move (fine-pointer devices only).
 * Adds depth to cards/images without being gimmicky.
 *
 *   <div appTilt [tiltMax]="6">…</div>
 */
@Directive({ selector: '[appTilt]', standalone: true })
export class TiltDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  @Input() tiltMax = 7;       // degrees
  @Input() tiltScale = 1.02;

  private enabled = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

  @HostListener('pointermove', ['$event'])
  onMove(e: PointerEvent): void {
    if (!this.enabled) return;
    const node = this.el.nativeElement;
    const r = node.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    this.zone.runOutsideAngular(() => {
      node.style.transform =
        `perspective(900px) rotateX(${(-py * this.tiltMax).toFixed(2)}deg) rotateY(${(px * this.tiltMax).toFixed(2)}deg) scale(${this.tiltScale})`;
    });
  }

  @HostListener('pointerleave')
  onLeave(): void {
    if (!this.enabled) return;
    const node = this.el.nativeElement;
    node.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
    node.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
    setTimeout(() => (node.style.transition = ''), 500);
  }

  @HostListener('pointerenter')
  onEnter(): void {
    if (!this.enabled) return;
    this.el.nativeElement.style.transition = 'transform .1s ease-out';
    this.el.nativeElement.style.willChange = 'transform';
  }
}
