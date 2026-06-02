import { Component } from '@angular/core';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { CountUpDirective } from '../../../shared/directives/count-up.directive';
import { ParallaxDirective } from '../../../shared/directives/parallax.directive';

@Component({
  selector: 'app-lake-section',
  standalone: true,
  imports: [RevealDirective, CountUpDirective, ParallaxDirective],
  template: `
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div appParallax [parallaxFactor]="0.26" class="absolute inset-x-0 -top-[16%] h-[132%]">
          <img [src]="bg" alt="Lac la apus" class="h-full w-full animate-ken-burns object-cover" loading="lazy" />
        </div>
        <div class="absolute inset-0 bg-ink-900/55"></div>
      </div>

      <div class="container-x relative py-24 text-center text-cream-50 sm:py-32 lg:py-40">
        <p class="eyebrow both !text-gold-200" appReveal="up">Experiența pe lac</p>
        <h2 class="mx-auto mt-4 max-w-3xl font-display text-4xl text-cream-50 sm:text-5xl lg:text-6xl" appReveal="blur" [revealDelay]="100">
          Când apa oglindește lumina, fiecare clipă devine memorabilă
        </h2>
        <div class="leaf-divider mt-7" appReveal="up" [revealDelay]="150">
          <span class="!bg-cream-50/40"></span><span class="mi text-[18px] text-gold-200">water_drop</span><span class="!bg-cream-50/40"></span>
        </div>

        <div class="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4"
             appReveal="up" [revealStagger]="120" [revealDelay]="200">
          @for (s of stats; track s.label) {
            <div class="flex flex-col items-center">
              <span class="mb-3 grid h-12 w-12 place-items-center rounded-full border border-gold-200/40 bg-cream-50/10 text-gold-200 backdrop-blur-sm">
                <span class="mi text-[24px]">{{ s.icon }}</span>
              </span>
              <p class="font-display text-4xl text-gold-200 sm:text-5xl"
                 [countUp]="s.value" [countSuffix]="s.suffix"></p>
              <p class="mt-2 text-xs uppercase tracking-widest2 text-cream-100/75">{{ s.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class LakeSectionComponent {
  readonly bg = '/home/lake/lake.jpg';
  readonly stats = [
    { value: 1000, suffix: '+', label: 'Evenimente', icon: 'celebration' },
    { value: 200, suffix: '', label: 'Invitați capacitate', icon: 'groups' },
    { value: 98, suffix: '%', label: 'Recomandă', icon: 'favorite' },
    { value: 15, suffix: '+', label: 'Ani experiență', icon: 'workspace_premium' }
  ];
}
