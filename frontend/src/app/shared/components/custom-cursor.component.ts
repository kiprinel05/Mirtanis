import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #dot class="cursor-dot" aria-hidden="true"></div>
    <div #ring class="cursor-ring" aria-hidden="true"></div>
  `,
  styles: [`
    :host {
      position: fixed; inset: 0; pointer-events: none; z-index: 60;
    }
    .cursor-dot, .cursor-ring {
      position: fixed; top: 0; left: 0; transform: translate(-50%, -50%);
      pointer-events: none; mix-blend-mode: difference;
      will-change: transform;
    }
    .cursor-dot {
      width: 6px; height: 6px; border-radius: 999px;
      background: #FBF6E9;
      transition: transform .15s ease-out;
    }
    .cursor-ring {
      width: 36px; height: 36px; border-radius: 999px;
      border: 1px solid rgba(205,166,74,0.65);
      transition: width .3s var(--ease-soft), height .3s var(--ease-soft), border-color .3s ease, transform .15s ease-out;
    }
    :host(.hover) .cursor-ring { width: 64px; height: 64px; border-color: #CDA64A; }
    @media (hover: none), (pointer: coarse) { :host { display: none; } }
  `]
})
export class CustomCursorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dot', { static: true }) dot!: ElementRef<HTMLDivElement>;
  @ViewChild('ring', { static: true }) ring!: ElementRef<HTMLDivElement>;
  private host = inject(ElementRef<HTMLElement>);

  private mouseX = 0; private mouseY = 0;
  private ringX = 0;  private ringY = 0;
  private rafId = 0;
  private hoverables = ['A', 'BUTTON'];

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    const loop = () => {
      this.ringX += (this.mouseX - this.ringX) * 0.15;
      this.ringY += (this.mouseY - this.ringY) * 0.15;
      this.dot.nativeElement.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
      this.ring.nativeElement.style.transform = `translate(${this.ringX}px, ${this.ringY}px)`;
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  @HostListener('document:mousemove', ['$event'])
  onMove(e: MouseEvent): void {
    this.mouseX = e.clientX; this.mouseY = e.clientY;
    const target = e.target as HTMLElement | null;
    const hovering = !!target && this.hoverables.includes(target.tagName);
    this.host.nativeElement.classList.toggle('hover', hovering);
  }

  ngOnDestroy(): void { cancelAnimationFrame(this.rafId); }
}
