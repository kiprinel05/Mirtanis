import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
  inject,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { ParticlesBgComponent } from "../../../../shared/components/particles-bg/particles-bg.component";
import { MagneticDirective } from "../../../../core/directives/magnetic.directive";
import { ScrollService } from "../../../../core/services/scroll.service";

interface Slide {
  src: string;
  alt: string;
}

@Component({
  selector: "fb-hero",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ParticlesBgComponent, MagneticDirective],
  template: `
    <section
      id="hero"
      class="relative h-screen min-h-[720px] w-full overflow-hidden flex items-center justify-center text-center"
      aria-label="Secțiune principală"
    >
      <!-- Background slideshow -->
      <div class="absolute inset-0 z-0">
        @for (slide of slides; track slide.src; let i = $index) {
          <div
            class="absolute inset-0 transition-opacity duration-[2400ms] ease-out"
            [class.opacity-100]="i === activeSlide"
            [class.opacity-0]="i !== activeSlide"
          >
            <img
              [src]="slide.src"
              [alt]="slide.alt"
              class="w-full h-full object-cover"
              loading="eager"
              [class.kenburns]="i === activeSlide"
            />
          </div>
        }
      </div>

      <!-- Dark cinematic overlay -->
      <div
        class="absolute inset-0 z-[1] bg-gradient-to-b from-primary/70 via-primary/55 to-primary"
        aria-hidden="true"
      ></div>
      <div
        class="absolute inset-0 z-[1] bg-radial-glow opacity-80"
        aria-hidden="true"
      ></div>

      <!-- Particles -->
      <fb-particles-bg
        class="absolute inset-0 z-[2]"
        [particleCount]="55"
      ></fb-particles-bg>

      <!-- Floating light orbs -->
      <div
        class="glow-orb glow-orb--gold w-[700px] h-[700px] -top-40 -left-40 z-[1] animate-float-slow"
      ></div>
      <div
        class="glow-orb glow-orb--purple w-[600px] h-[600px] -bottom-40 -right-40 z-[1] animate-float"
      ></div>

      <!-- Decorative parallax frame lines -->
      <div
        class="hidden md:block absolute top-24 left-8 right-8 bottom-24 z-[3] border border-gold/10 pointer-events-none mb-5"
        aria-hidden="true"
      ></div>

      <!-- Hero content -->
      <div
        #content
        class="relative z-[4] max-w-5xl mx-auto px-6 lg:px-10 flex flex-col items-center gap-7"
      >
        <h1
          class="hero-title text-display text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] text-offwhite leading-[0.95] text-balance"
        >
          <span class="block">Transformăm momente</span>
          <span class="block">
            în amintiri <em class="text-gold-gradient not-italic">eterne</em>.
          </span>
        </h1>

        <p
          class="hero-sub opacity-0 max-w-2xl text-base md:text-lg text-offwhite/70 leading-relaxed font-body"
        >
          Fotografie premium pentru nunți, botezuri, evenimente și sesiuni
          artistice de studio. Creată cu lumină, emoție și grijă pentru fiecare
          detaliu.
        </p>

        <div
          class="hero-cta opacity-0 flex flex-col sm:flex-row items-center gap-4 mt-3"
        >
          <a
            href="#portfolio"
            (click)="onCta($event, '#portfolio')"
            fbMagnetic
            class="btn-primary"
          >
            Vezi Portofoliul
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class="w-4 h-4 ml-1"
            >
              <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" />
            </svg>
          </a>
          <a
            href="#contact"
            (click)="onCta($event, '#contact')"
            fbMagnetic
            class="btn-outline"
            >Rezervă o Ședință</a
          >
        </div>

        <!-- Meta strip -->
        <div
          class="hero-meta opacity-0 mt-12 flex flex-wrap justify-center gap-x-10 gap-y-3 text-[10px] tracking-[0.4em] uppercase text-offwhite/50 font-body"
        >
          <span>✦ Studio Foto</span>
          <span>✦ Rezervări Online</span>
          <span>✦ Din 2019</span>
        </div>
      </div>

      <!-- Scroll indicator -->
      <button
        (click)="scrollDown()"
        class="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] flex flex-col items-center gap-3 text-offwhite/60 hover:text-gold transition-colors group"
        aria-label="Derulează în jos"
      >
        <span class="text-[10px] tracking-[0.4em] uppercase">Derulează</span>
        <div
          class="w-6 h-10 rounded-full border border-current flex justify-center pt-1.5"
        >
          <div class="w-[2px] h-2 bg-current rounded-full animate-scroll"></div>
        </div>
      </button>
    </section>
  `,
  styles: [
    `
      @keyframes kenburns {
        0% {
          transform: scale(1.05) translate(0, 0);
        }
        100% {
          transform: scale(1.18) translate(-2%, -2%);
        }
      }
      .kenburns {
        animation: kenburns 9s ease-out forwards;
      }

      .hero-title :first-child,
      .hero-title :nth-child(2) {
        opacity: 0;
        transform: translateY(60px);
      }
      :host-context(html.app-ready) .hero-title :first-child,
      :host-context(html.app-ready) .hero-title :nth-child(2) {
        animation: reveal-line 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      :host-context(html.app-ready) .hero-title :nth-child(2) {
        animation-delay: 0.25s;
      }

      @keyframes reveal-line {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      :host-context(html.app-ready) .hero-tag {
        animation: fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
      }
      :host-context(html.app-ready) .hero-sub {
        animation: fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards;
      }
      :host-context(html.app-ready) .hero-cta {
        animation: fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.95s forwards;
      }
      :host-context(html.app-ready) .hero-meta {
        animation: fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards;
      }

      @keyframes fade-up {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class HeroComponent implements AfterViewInit {
  @ViewChild("content") contentRef?: ElementRef<HTMLElement>;

  private readonly scrollSvc = inject(ScrollService);

  protected activeSlide = 0;

  protected readonly slides: Slide[] = [
    {
      src: "assets/hero/8D9A9999-339.jpg",
      alt: "Foto Bugeac — Cadru cinematografic 1",
    },
    {
      src: "assets/hero/BUG07357-Enhanced-NR.jpg",
      alt: "Foto Bugeac — Cadru cinematografic 2",
    },
    {
      src: "assets/hero/DSC_9437.jpg",
      alt: "Ceremonie de nuntă elegantă",
    },
    {
      src: "assets/hero/DSC02286.jpg",
      alt: "Moment cinematografic 4",
    },
    {
      src: "assets/hero/8D9A9999-6.jpg",
      alt: "Moment cinematografic 5",
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setInterval(() => {
      this.activeSlide = (this.activeSlide + 1) % this.slides.length;
    }, 6500);
  }

  protected onCta(e: Event, href: string): void {
    e.preventDefault();
    this.scrollSvc.scrollTo(href, -80);
  }

  protected scrollDown(): void {
    this.scrollSvc.scrollTo("#services", -80);
  }
}
