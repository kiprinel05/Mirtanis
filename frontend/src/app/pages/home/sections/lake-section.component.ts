import { Component } from '@angular/core';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { CountUpDirective } from '../../../shared/directives/count-up.directive';
import { ParallaxDirective } from '../../../shared/directives/parallax.directive';
import { IMAGES } from '../../../shared/data/images';

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

        <div class="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4"
             appReveal="up" [revealStagger]="120" [revealDelay]="150">
          @for (s of stats; track s.label) {
            <div>
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
  readonly bg = IMAGES.lakeSunset;
  readonly stats = [
    { value: 1000, suffix: '+', label: 'Evenimente' },
    { value: 200, suffix: '', label: 'Invitați capacitate' },
    { value: 98, suffix: '%', label: 'Recomandă' },
    { value: 20, suffix: '+', label: 'Ani experiență' }
  ];
}
