import { AfterViewInit, Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppStateService } from '../../../core/services/app-state.service';
import { ParallaxDirective } from '../../../shared/directives/parallax.directive';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [RouterLink, ParallaxDirective],
  template: `
    <section class="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <!-- Background image with slow ken-burns + scroll parallax -->
      <div class="absolute inset-0 overflow-hidden">
        <div appParallax [parallaxFactor]="0.22" class="absolute inset-x-0 -top-[14%] h-[128%]">
          <img [src]="hero" alt="Locație de nuntă pe malul lacului Mirtanis"
               class="h-full w-full animate-ken-burns object-cover" fetchpriority="high" />
        </div>
        <!-- Layered scrims: top (for navbar), bottom fade, and a centred focus glow -->
        <div class="absolute inset-0 bg-gradient-to-b from-cream-50/45 via-transparent to-cream-100/95"></div>
        <div class="absolute inset-0"
             style="background: radial-gradient(58% 50% at 50% 46%, rgba(40,30,16,0.40) 0%, rgba(40,30,16,0.18) 38%, rgba(40,30,16,0) 70%);"></div>
      </div>

      <!-- Floating petals -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        @for (p of petals; track $index) {
          <span class="petal" [style.left.%]="p.l" [style.animation-delay.s]="p.d" [style.animation-duration.s]="p.dur"></span>
        }
      </div>

      <!-- Content -->
      <div #content class="container-x relative z-10 text-center" style="text-shadow: 0 2px 30px rgba(30,22,10,0.35);">
        <p class="hero-line script text-3xl text-gold-100 sm:text-4xl">Bine ați venit la</p>
        <h1 class="hero-line mt-3 font-display text-6xl font-semibold leading-[1.0] text-cream-50 sm:text-7xl lg:text-[7.5rem]">
          Mirtanis <span class="gold-text-bright gold-shimmer">Events</span>
        </h1>
        <div class="hero-line mx-auto mt-6 flex max-w-md items-center justify-center gap-4 text-cream-50/90">
          <span class="h-px w-10 bg-cream-50/50"></span>
          <span class="text-xs uppercase tracking-widest2">Locație de poveste pe lac</span>
          <span class="h-px w-10 bg-cream-50/50"></span>
        </div>
        <p class="hero-line mx-auto mt-6 max-w-xl text-balance text-base text-cream-50/90 sm:text-lg">
          Nunți, botezuri și evenimente private pe malul lacului — un decor de poveste,
          cu lumină caldă, apă liniștită și amintiri care rămân.
        </p>
        <div class="hero-line mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a routerLink="/rezervari" class="btn btn-gold w-full sm:w-auto">Verifică disponibilitatea</a>
          <a routerLink="/galerie" class="btn btn-hero-ghost w-full sm:w-auto">Descoperă galeria</a>
        </div>
      </div>

      <!-- Scroll cue -->
      <div class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div class="flex flex-col items-center gap-2 text-gold-700">
          <span class="text-[10px] font-medium uppercase tracking-widest2">Derulează</span>
          <span class="scroll-cue"></span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-line { opacity: 0; }

    /* brighter gold gradient that pops on the darker scrim */
    :host ::ng-deep .gold-text-bright {
      background: linear-gradient(120deg, #e9c97a 0%, #f6e7b8 45%, #d8af55 100%);
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }

    .btn-hero-ghost {
      border: 1px solid rgba(255,255,255,.7);
      color: #fff; background: rgba(255,255,255,.08);
      backdrop-filter: blur(4px);
    }
    .btn-hero-ghost:hover { background: rgba(255,255,255,.18); transform: translateY(-2px); }

    .petal {
      position: absolute; top: -5%;
      /* Responsive size — grows on wider screens */
      width: clamp(12px, 1.4vw, 26px); height: clamp(12px, 1.4vw, 26px);
      border-radius: 80% 10% 80% 10%;
      background: rgba(231, 194, 182, .6);
      animation-name: petal-fall; animation-timing-function: linear; animation-iteration-count: infinite;
    }
    @keyframes petal-fall {
      0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
      10%  { opacity: .8; }
      100% { transform: translateY(108vh) rotate(420deg); opacity: 0; }
    }

    .scroll-cue {
      position: relative; display: block; width: 22px; height: 36px;
      border: 1px solid rgba(154,114,46,.55); border-radius: 999px;
    }
    .scroll-cue::after {
      content: ''; position: absolute; left: 50%; top: 7px;
      width: 4px; height: 8px; margin-left: -2px; border-radius: 999px; background: #b68a36;
      animation: scroll-dot 1.6s ease-in-out infinite;
    }
    @keyframes scroll-dot {
      0% { transform: translateY(0); opacity: 0; }
      30% { opacity: 1; }
      60% { transform: translateY(12px); opacity: 0; }
      100% { transform: translateY(12px); opacity: 0; }
    }
  `]
})
export class HeroSectionComponent implements AfterViewInit {
  private readonly appState = inject(AppStateService);
  private readonly content = viewChild<ElementRef<HTMLElement>>('content');
  private viewReady = false;

  readonly hero = '/hero/hero.png';
  readonly petals = Array.from({ length: 16 }, () => ({
    l: Math.round(Math.random() * 100),
    d: +(Math.random() * 8).toFixed(1),
    dur: +(9 + Math.random() * 8).toFixed(1)
  }));

  constructor() {
    effect(() => {
      if (this.appState.ready() && this.viewReady) this.play();
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.appState.ready()) this.play();
  }

  private play(): void {
    const root = this.content()?.nativeElement;
    if (!root) return;
    const lines = Array.from(root.querySelectorAll<HTMLElement>('.hero-line'));
    lines.forEach((el, i) => {
      el.animate(
        [
          { opacity: 0, transform: 'translateY(40px)', filter: 'blur(6px)' },
          { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }
        ],
        { duration: 1000, delay: 200 + i * 130, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'both' }
      );
    });
  }
}
