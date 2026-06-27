import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  signal,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RevealOnScrollDirective } from '../../../../core/directives/reveal-on-scroll.directive';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

@Component({
  selector: 'fb-testimonials',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <section
      id="testimonials"
      class="relative section-padding bg-secondary overflow-hidden"
      aria-label="Testimoniale"
    >
      <div
        class="glow-orb glow-orb--gold w-[500px] h-[500px] -top-32 -left-32 opacity-25"
      ></div>
      <div
        class="glow-orb glow-orb--purple w-[500px] h-[500px] -bottom-32 -right-32 opacity-20"
      ></div>

      <div class="container-elegant relative">
        <!-- Header -->
        <div class="text-center mb-14" fbReveal="fade">
          <div
            class="inline-flex items-center gap-3 mb-5 text-[11px] tracking-[0.4em] uppercase text-gold/80"
          >
            <span class="h-[1px] w-10 bg-gold/40"></span>
            <span>Voci</span>
            <span class="h-[1px] w-10 bg-gold/40"></span>
          </div>
          <h2
            class="text-display text-5xl md:text-6xl text-offwhite text-balance leading-[1.05]"
          >
            Ce
            <em class="text-gold-gradient not-italic">șoptesc</em>
            clienții noștri.
          </h2>
        </div>

        <!-- Carousel -->
        <div
          class="relative max-w-4xl mx-auto"
          fbReveal="fade"
          (mouseenter)="pause()"
          (mouseleave)="play()"
        >
          <!-- Slides -->
          <div class="relative h-[380px] md:h-[340px]">
            @for (t of testimonials; track t.name; let i = $index) {
              <article
                class="absolute inset-0 transition-all duration-700 ease-cinematic"
                [class.opacity-100]="i === active()"
                [class.opacity-0]="i !== active()"
                [class.translate-x-0]="i === active()"
                [class.translate-x-8]="i > active()"
                [class.-translate-x-8]="i < active()"
                [class.pointer-events-none]="i !== active()"
                [attr.aria-hidden]="i !== active()"
              >
                <div
                  class="glass-strong rounded-2xl p-8 md:p-12 h-full flex flex-col justify-between"
                >
                  <!-- Stars -->
                  <div class="flex gap-1 mb-5">
                    @for (s of stars(t.rating); track $index) {
                      <span class="text-gold text-lg animate-pulse-slow"
                        >★</span
                      >
                    }
                  </div>

                  <!-- Quote -->
                  <blockquote
                    class="font-display text-2xl md:text-3xl text-offwhite leading-snug text-balance"
                  >
                    <span class="text-gold/40 text-5xl leading-none align-top mr-2">“</span>
                    {{ t.quote }}
                    <span class="text-gold/40 text-5xl leading-none ml-1">”</span>
                  </blockquote>

                  <!-- Author -->
                  <div class="flex items-center gap-4 mt-6">
                    <div
                      class="w-14 h-14 rounded-full flex items-center justify-center border border-gold/40 bg-gradient-to-br from-gold/15 to-transparent text-gold-gradient font-display text-base tracking-wider"
                      [attr.aria-label]="t.name"
                    >
                      {{ initials(t.name) }}
                    </div>
                    <div>
                      <div class="font-display text-lg text-offwhite">
                        {{ t.name }}
                      </div>
                      <div
                        class="text-[10px] tracking-[0.3em] uppercase text-gold/70"
                      >
                        {{ t.role }}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            }
          </div>

          <!-- Dots -->
          <div class="flex justify-center gap-2 mt-8">
            @for (t of testimonials; track t.name; let i = $index) {
              <button
                (click)="setActive(i)"
                [attr.aria-label]="'Afișează testimonialul ' + (i + 1)"
                class="h-[3px] rounded-full transition-all duration-500"
                [class.w-12]="i === active()"
                [class.w-5]="i !== active()"
                [class.bg-gold]="i === active()"
                [class.bg-white]="i !== active()"
                [class.bg-opacity-20]="i !== active()"
              ></button>
            }
          </div>

          <!-- Arrows -->
          <button
            (click)="prev()"
            class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 rounded-full border border-white/15 items-center justify-center text-offwhite hover:border-gold hover:text-gold transition-colors"
            aria-label="Testimonial anterior"
          >
            ‹
          </button>
          <button
            (click)="next()"
            class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 rounded-full border border-white/15 items-center justify-center text-offwhite hover:border-gold hover:text-gold transition-colors"
            aria-label="Testimonial următor"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  `,
})
export class TestimonialsComponent implements AfterViewInit, OnDestroy {
  protected readonly active = signal(0);
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private paused = false;

  protected readonly testimonials: Testimonial[] = [
    {
      name: 'Elena & Andrei',
      role: 'Nuntă 2024',
      quote:
        'Privindu-ne fotografiile încă ne dau fiori. Au surprins fiecare privire, fiecare lacrimă, fiecare râset — exact așa cum am trăit ziua.',
      rating: 5,
    },
    {
      name: 'Sofia M.',
      role: 'Ședință Maternitate',
      quote:
        'O ședință calmă și delicată, care n-a semănat deloc cu un shooting — iar fotografiile par operă de artă pe pereții noștri.',
      rating: 5,
    },
    {
      name: 'David R.',
      role: 'Gală Corporativă',
      quote:
        'Echipa s-a integrat perfect, n-a ratat nimic și a livrat imagini care au înălțat întreaga noastră prezentare de brand.',
      rating: 5,
    },
    {
      name: 'Familia Popa',
      role: 'Botez',
      quote:
        'Caldă, răbdătoare și incredibil de artistică. Albumul nostru pare o comoară pe care o vom transmite din generație în generație.',
      rating: 5,
    },
  ];

  protected initials(name: string): string {
    return name
      .split(/\s+|&/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join('');
  }

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.play();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  protected stars(n: number): number[] {
    return Array.from({ length: n });
  }

  protected setActive(i: number): void {
    this.active.set(i);
  }

  protected next(): void {
    this.active.update((v) => (v + 1) % this.testimonials.length);
  }

  protected prev(): void {
    this.active.update(
      (v) => (v - 1 + this.testimonials.length) % this.testimonials.length,
    );
  }

  protected play(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.paused = false;
    this.intervalId = setInterval(() => {
      if (!this.paused) this.next();
    }, 6000);
  }

  protected pause(): void {
    this.paused = true;
  }
}
