import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParallaxDirective } from '../../../../core/directives/parallax.directive';
import { RevealOnScrollDirective } from '../../../../core/directives/reveal-on-scroll.directive';

@Component({
  selector: 'fb-storytelling',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ParallaxDirective, RevealOnScrollDirective],
  template: `
    <section
      class="relative h-[110vh] min-h-[800px] flex items-center justify-center overflow-hidden"
      aria-label="Filozofie"
    >
      <!-- Layered parallax backgrounds -->
      <div class="absolute inset-0 z-0">
        <img
          src="assets/hero/DSC02286.jpg"
          alt=""
          aria-hidden="true"
          class="w-full h-full object-cover"
          [fbParallax]="0.3"
        />
      </div>

      <div
        class="absolute inset-0 z-[1] bg-gradient-to-b from-primary via-primary/60 to-primary"
        aria-hidden="true"
      ></div>

      <!-- Floating frames -->
      <div
        class="absolute top-[18%] left-[6%] w-32 md:w-44 aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-elegant animate-float-slow z-[2] hidden md:block"
        [fbParallax]="-0.2"
      >
        <img
          src="assets/portfolio/nunta-2-9-16.jpg"
          alt=""
          aria-hidden="true"
          class="w-full h-full object-cover"
        />
      </div>

      <div
        class="absolute top-[22%] right-[7%] w-36 md:w-52 aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-elegant animate-float z-[2] hidden md:block"
        [fbParallax]="-0.15"
      >
        <img
          src="assets/portfolio/botez-2-9-16.jpg"
          alt=""
          aria-hidden="true"
          class="w-full h-full object-cover"
        />
      </div>

      <div
        class="absolute bottom-[16%] left-[10%] w-28 md:w-40 aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-elegant animate-float-slow z-[2] hidden md:block"
        [fbParallax]="-0.25"
      >
        <img
          src="assets/portfolio/nunta-4-9-16.jpg"
          alt=""
          aria-hidden="true"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Center quote -->
      <div
        class="relative z-[3] text-center max-w-4xl mx-auto px-6"
        fbReveal="fade"
      >
        <!-- Camera icon -->
        <div
          class="inline-flex items-center justify-center w-20 h-20 rounded-full border border-gold/30 mb-10 text-gold animate-float"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            class="w-10 h-10"
          >
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <circle cx="12" cy="13" r="4.5" />
            <path d="M9 7l1.5-3h3L15 7" />
          </svg>
        </div>

        <p
          class="text-[10px] tracking-[0.5em] uppercase text-gold/80 mb-6 font-body"
        >
          O filozofie
        </p>

        <blockquote
          class="text-display text-4xl md:text-6xl lg:text-7xl text-offwhite leading-[1.05] text-balance"
        >
          „Fiecare fotografie
          <em class="text-gold-gradient not-italic">spune o poveste.</em>”
        </blockquote>

        <p class="mt-10 text-offwhite/65 max-w-xl mx-auto leading-relaxed">
          Nu urmărim trenduri — urmărim adevărul. Lumina, emoția și prezența
          autentică sunt singura limbă pe care obiectivul nostru o vorbește.
        </p>

        <!-- Decorative lines -->
        <div class="flex items-center justify-center gap-4 mt-10">
          <div class="h-[1px] w-24 bg-gradient-to-r from-transparent to-gold/50"></div>
          <span class="text-gold/70">✦</span>
          <div class="h-[1px] w-24 bg-gradient-to-l from-transparent to-gold/50"></div>
        </div>
      </div>
    </section>
  `,
})
export class StorytellingComponent {}
