import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { ParallaxDirective } from '../../../shared/directives/parallax.directive';

@Component({
  selector: 'app-lake-section',
  standalone: true,
  imports: [CommonModule, RevealDirective, ParallaxDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative py-32 md:py-44 overflow-hidden water-reflect">
      <div class="absolute inset-0 -z-0">
        <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=2000&q=80"
             alt="Lac la apus" loading="lazy"
             class="w-full h-full object-cover scale-110" appParallax [parallaxFactor]="0.08" />
        <div class="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/70 to-ink-950"></div>
        <div class="absolute inset-0 bg-lux-radial"></div>
      </div>

      <div class="container-luxe relative z-10 px-6 grid lg:grid-cols-12 gap-12">
        <div class="lg:col-span-7">
          <span appReveal class="eyebrow">Experiența pe lac</span>
          <h2 appReveal [revealDelay]="120" class="mt-5 font-display text-4xl md:text-6xl text-white leading-[1.05]">
            Lumini pe apă. Liniște. <span class="gold-text">Apus de poveste.</span>
          </h2>
          <p appReveal [revealDelay]="220" class="mt-7 text-white/75 text-lg leading-relaxed max-w-2xl">
            Pontoane elegante, alei iluminate peste poduri romantice și o barcă rezervată
            pentru ședințele foto. Fiecare detaliu este compus pentru momente cinematice —
            de la primul „da” până la dansul de la miezul nopții.
          </p>

          <div appReveal [revealDelay]="320" class="mt-10 grid sm:grid-cols-3 gap-5 max-w-2xl">
            <div class="glass rounded-2xl p-5">
              <p class="font-display text-3xl gold-text">5+</p>
              <p class="mt-1 text-xs tracking-widest uppercase text-white/70">Pontoane</p>
            </div>
            <div class="glass rounded-2xl p-5">
              <p class="font-display text-3xl gold-text">1</p>
              <p class="mt-1 text-xs tracking-widest uppercase text-white/70">Barcă foto</p>
            </div>
            <div class="glass rounded-2xl p-5">
              <p class="font-display text-3xl gold-text">∞</p>
              <p class="mt-1 text-xs tracking-widest uppercase text-white/70">Amintiri</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 relative h-[480px]">
          <div class="absolute inset-0 rounded-3xl overflow-hidden img-cine shadow-glow-gold">
            <img src="https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=1200&q=80"
                 alt="Barcă pe lac la apus" loading="lazy" class="w-full h-full object-cover"/>
            <div class="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent"></div>
          </div>
          <div class="absolute -bottom-6 -left-6 glass rounded-2xl px-6 py-5 max-w-[260px]">
            <p class="font-display italic text-xl text-white leading-snug">
              „Mirific locație pe lac. Cea mai frumoasă locație pentru evenimente.”
            </p>
            <p class="mt-3 eyebrow text-[10px] text-gold-300">— invitat Mirtanis</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LakeSectionComponent {}
