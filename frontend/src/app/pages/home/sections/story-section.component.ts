import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { ParallaxDirective } from '../../../shared/directives/parallax.directive';

@Component({
  selector: 'app-story-section',
  standalone: true,
  imports: [CommonModule, RevealDirective, ParallaxDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section relative overflow-hidden">
      <div class="absolute -top-40 -left-40 w-[480px] h-[480px] bg-gold-400/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-[520px] h-[520px] bg-lake-400/10 rounded-full blur-3xl"></div>

      <div class="container-luxe grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div>
          <span appReveal class="eyebrow">Povestea noastră</span>
          <h2 appReveal [revealDelay]="100" class="mt-5 font-display text-4xl md:text-6xl text-white leading-tight">
            Un <span class="gold-text">tărâm pe apă</span>, creat pentru momentele care contează.
          </h2>
          <div appReveal [revealDelay]="200" class="divider-gold w-24 mt-8"></div>
          <p appReveal [revealDelay]="300" class="mt-8 text-white/75 text-lg leading-relaxed max-w-xl">
            Întregul complex Mirtanis este așezat în mijlocul unui lac liniștit, înconjurat
            de poduri elegante, alei iluminate și pontoane premium. Cortul nostru de evenimente
            și sala interioară rafinată sunt gândite ca să transforme orice ceremonie într-o
            experiență cinematică.
          </p>
          <blockquote appReveal [revealDelay]="400" class="mt-10 font-display italic text-2xl md:text-3xl text-gold-200 border-l-2 border-gold-400/60 pl-6">
            „Locație de poveste, un lac superb, mirific. Un loc de neuitat.”
          </blockquote>
          <p appReveal [revealDelay]="500" class="mt-3 text-white/50 text-sm">— recenzii reale ale invitaților noștri</p>
        </div>

        <div class="relative h-[560px] md:h-[640px]">
          <div appParallax [parallaxFactor]="0.06" class="absolute top-0 right-0 w-2/3 h-2/3 img-cine shadow-glass">
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                 alt="Cort premium pe lac" loading="lazy" class="w-full h-full object-cover" />
          </div>
          <div appParallax [parallaxFactor]="-0.04" class="absolute bottom-0 left-0 w-3/5 h-3/5 img-cine shadow-glass border border-gold-400/30">
            <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80"
                 alt="Pontoane peste lac" loading="lazy" class="w-full h-full object-cover" />
          </div>
          <div class="absolute -bottom-6 right-1/3 glass rounded-2xl px-6 py-5 shadow-glow-gold">
            <p class="font-display italic text-2xl text-white">4.5<span class="text-gold-300">/5</span></p>
            <p class="text-xs text-white/60 mt-1 tracking-widest uppercase">Google Reviews</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class StorySectionComponent {}
