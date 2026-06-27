import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  ViewChild,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RevealOnScrollDirective } from "../../../../core/directives/reveal-on-scroll.directive";

@Component({
  selector: "fb-before-after",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <section
      class="relative section-padding bg-primary overflow-hidden"
      aria-label="Înainte și după editare"
    >
      <div
        class="glow-orb glow-orb--gold w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15"
      ></div>

      <div class="container-elegant relative max-w-5xl mx-auto">
        <div class="text-center mb-12" fbReveal="fade">
          <div
            class="inline-flex items-center gap-3 mb-5 text-[11px] tracking-[0.4em] uppercase text-gold/80"
          >
            <span class="h-[1px] w-10 bg-gold/40"></span>
            <span>Măiestria</span>
            <span class="h-[1px] w-10 bg-gold/40"></span>
          </div>
          <h2
            class="text-display text-4xl md:text-6xl text-offwhite mb-4 text-balance"
          >
            De la brut la
            <em class="text-gold-gradient not-italic">rafinat</em>.
          </h2>
          <p class="text-offwhite/60 max-w-xl mx-auto">
            Trage pentru a dezvălui diferența pe care o face arta noastră de
            editare — culoare, lumină, ten și atmosferă.
          </p>
        </div>

        <!-- Slider -->
        <div
          #container
          (mousedown)="startDrag($event)"
          (touchstart)="startDrag($event)"
          class="relative rounded-2xl overflow-hidden aspect-[16/9] select-none cursor-ew-resize"
          fbReveal="fade"
        >
          <!-- After (full) -->
          <img
            src="assets/before-after/after.jpg"
            alt="După editare"
            loading="lazy"
            class="absolute inset-0 w-full h-full object-cover"
            draggable="false"
          />

          <!-- Before (clipped) -->
          <div
            class="absolute inset-0 overflow-hidden"
            [style.clip-path]="
              'polygon(0 0, ' +
              position() +
              '% 0, ' +
              position() +
              '% 100%, 0 100%)'
            "
          >
            <img
              src="assets/before-after/before.jpg"
              alt="Înainte de editare"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover"
              draggable="false"
            />
          </div>

          <!-- Labels -->
          <div
            class="absolute top-5 left-5 glass-strong rounded-full px-4 py-1.5 text-[10px] tracking-[0.3em] uppercase text-offwhite/80"
          >
            Înainte
          </div>
          <div
            class="absolute top-5 right-5 bg-gold text-primary rounded-full px-4 py-1.5 text-[10px] tracking-[0.3em] uppercase font-medium"
          >
            După
          </div>

          <!-- Handle -->
          <div
            class="absolute top-0 bottom-0 w-[2px] bg-gold/80 shadow-[0_0_20px_rgba(212,175,55,0.7)] pointer-events-none"
            [style.left.%]="position()"
            style="transform: translateX(-50%);"
          >
            <div
              class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gold flex items-center justify-center shadow-glow"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0B0B0F"
                stroke-width="2"
                class="w-5 h-5"
              >
                <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" stroke-linecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class BeforeAfterComponent {
  @ViewChild("container", { static: false })
  containerRef?: ElementRef<HTMLElement>;

  protected readonly position = signal(50);
  private dragging = false;

  protected startDrag(e: MouseEvent | TouchEvent): void {
    this.dragging = true;
    this.move(e);
  }

  @HostListener("window:mousemove", ["$event"])
  @HostListener("window:touchmove", ["$event"])
  onMove(e: MouseEvent | TouchEvent): void {
    if (!this.dragging) return;
    this.move(e);
  }

  @HostListener("window:mouseup")
  @HostListener("window:touchend")
  onEnd(): void {
    this.dragging = false;
  }

  private move(e: MouseEvent | TouchEvent): void {
    if (!this.containerRef) return;
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0]?.clientX;
    if (clientX === undefined) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    this.position.set(Math.max(0, Math.min(100, p)));
  }
}
