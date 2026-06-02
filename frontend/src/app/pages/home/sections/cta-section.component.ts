import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { ParallaxDirective } from '../../../shared/directives/parallax.directive';
import { IMAGES } from '../../../shared/data/images';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [RouterLink, RevealDirective, ParallaxDirective],
  template: `
    <section class="section">
      <div class="container-x">
        <div class="relative overflow-hidden rounded-4xl shadow-card" appReveal="scale">
          <div appParallax [parallaxFactor]="0.18" class="absolute inset-x-0 -top-[14%] h-[128%]">
            <img [src]="bg" alt="Lac la apus" class="h-full w-full object-cover" loading="lazy" />
          </div>
          <div class="absolute inset-0 bg-sage-700/78"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-sage-700 via-sage-700/60 to-sage-700/45"></div>
          <div class="relative px-7 py-16 text-center text-cream-50 sm:px-12 sm:py-24" style="text-shadow:0 2px 18px rgba(20,30,15,.5)">
            <p class="script text-3xl !text-gold-200 sm:text-4xl">Hai să ne cunoaștem</p>
            <h2 class="mx-auto mt-3 max-w-2xl font-display text-4xl text-cream-50 sm:text-5xl">
              Rezervă o vizită la locația de pe lac
            </h2>
            <p class="mx-auto mt-5 max-w-xl text-cream-100/85">
              Spune-ne data și detaliile evenimentului tău, iar noi îți pregătim o ofertă personalizată.
            </p>
            <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a routerLink="/rezervari" class="btn btn-gold w-full sm:w-auto">Verifică disponibilitatea</a>
              <a routerLink="/contact" class="btn btn-outline w-full !border-cream-100/60 !text-cream-50 hover:!bg-cream-50/10 sm:w-auto">
                Contactează-ne
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class CtaSectionComponent {
  readonly bg = IMAGES.lakeSunset;
}
