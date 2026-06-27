import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[fbMagnetic]',
  standalone: true,
})
export class MagneticDirective {
  @Input() strength = 0.35;
  @Input() radius = 80;

  private readonly elRef = inject(ElementRef<HTMLElement>);
  private rect: DOMRect | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  @HostListener('mouseenter')
  onEnter(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = this.elRef.nativeElement;
    el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    this.rect = el.getBoundingClientRect();
  }

  @HostListener('mousemove', ['$event'])
  onMove(e: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId) || !this.rect) return;
    const el = this.elRef.nativeElement;
    const cx = this.rect.left + this.rect.width / 2;
    const cy = this.rect.top + this.rect.height / 2;
    const dx = (e.clientX - cx) * this.strength;
    const dy = (e.clientY - cy) * this.strength;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  @HostListener('mouseleave')
  onLeave(): void {
    const el = this.elRef.nativeElement;
    el.style.transform = 'translate(0, 0)';
  }
}
