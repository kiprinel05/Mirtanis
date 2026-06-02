import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { ParallaxDirective } from '../../../shared/directives/parallax.directive';
import { FloralCornerComponent } from '../../../shared/components/floral-corner.component';
import { IMAGES } from '../../../shared/data/images';

@Component({
  selector: 'app-locations-section',
  standalone: true,
  imports: [RouterLink, RevealDirective, ParallaxDirective, FloralCornerComponent],
  template: `
    <section class="section relative overflow-hidden">
      <app-floral-corner corner="tr" [size]="200" />
      <app-floral-corner corner="bl" [size]="180" />

      <div class="container-x relative">
        <div class="mx-auto max-w-2xl text-center" appReveal="up">
          <p class="eyebrow both">Locația noastră</p>
          <h2 class="mt-4 font-display text-4xl text-ink-900 sm:text-5xl" appReveal="blur" [revealDelay]="80">
            Cortul de pe malul lacului
          </h2>
          <p class="mt-5 text-ink-600">
            Inima Mirtanis Events — un cort de poveste, deschis spre apă și cer, unde natura devine decorul tău.
          </p>
        </div>

        <div class="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-7">
          <!-- HERO CARD: the tent (takes 2/3 on desktop) -->
          <article appReveal="left"
                   class="group hover-lift relative overflow-hidden rounded-4xl shadow-card lg:col-span-2 min-h-[460px] sm:min-h-[540px]">
            <div class="absolute inset-0 overflow-hidden">
              <div appParallax [parallaxFactor]="0.08" class="absolute inset-x-0 -top-[8%] h-[116%]">
                <img [src]="tent.img" [alt]="tent.title" class="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105" loading="lazy" />
              </div>
            </div>
            <!-- base tint for overall legibility + strong bottom gradient for the text -->
            <div class="absolute inset-0 bg-ink-900/25"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-ink-900 from-5% via-ink-900/70 via-45% to-ink-900/10"></div>

            <!-- Featured badge -->
            <span class="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-gold-500/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest2 text-[#2a1f0e] shadow-soft sm:left-9 sm:top-9">
              <span class="mi text-[16px]">star</span> Atracția principală
            </span>

            <div class="absolute inset-x-0 bottom-0 p-7 sm:p-9" style="text-shadow:0 2px 18px rgba(0,0,0,.6)">
              <p class="text-xs font-medium uppercase tracking-widest2 text-gold-200">{{ tent.tag }}</p>
              <h3 class="mt-2 font-display text-4xl text-cream-50 sm:text-5xl">{{ tent.title }}</h3>
              <p class="mt-3 max-w-lg text-sm leading-relaxed text-cream-50 sm:text-base">{{ tent.desc }}</p>

              <ul class="mt-5 flex flex-wrap gap-2">
                @for (f of tent.features; track f) {
                  <li class="inline-flex items-center gap-1.5 rounded-full bg-cream-50/15 px-3 py-1.5 text-xs text-cream-50 backdrop-blur-sm">
                    <span class="mi text-[15px] text-gold-200">{{ f.icon }}</span> {{ f.label }}
                  </li>
                }
              </ul>

              <a routerLink="/locatii" class="btn btn-gold mt-7">Descoperă cortul</a>
            </div>
          </article>

          <!-- SECONDARY CARD: the hall (alternative) -->
          <article appReveal="right" [revealDelay]="120"
                   class="group hover-lift relative overflow-hidden rounded-4xl border border-cream-300/70 bg-cream-50/70 backdrop-blur-sm shadow-soft">
            <div class="aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-1/2">
              <img [src]="hall.img" [alt]="hall.title" class="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105" loading="lazy" />
            </div>
            <div class="p-6 sm:p-7">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-[10px] font-medium uppercase tracking-widest2 text-sage-600">
                <span class="mi text-[14px]">ac_unit</span> Alternativă all-season
              </span>
              <h3 class="mt-3 font-display text-2xl text-ink-900 sm:text-3xl">{{ hall.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-ink-600">{{ hall.desc }}</p>
              <a routerLink="/locatii"
                 class="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-700 transition-all hover:gap-2.5">
                Vezi sala <span class="mi text-[18px]">arrow_forward</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  `
})
export class LocationsSectionComponent {
  readonly tent = {
    title: 'Cort Premium pe Lac',
    tag: 'În aer liber · pe malul lacului',
    img: IMAGES.tentExterior,
    desc: 'Structură elegantă cu pereți transparenți, deschisă spre apă și cer. Ziua, lumina naturală se revarsă înăuntru; seara, ghirlandele aurii transformă totul într-un decor de basm — emoție pură, sub stele.',
    features: [
      { icon: 'waves', label: 'Vedere la lac' },
      { icon: 'nature', label: 'Decor natural' },
      { icon: 'wb_twilight', label: 'Apus spectaculos' },
      { icon: 'groups', label: 'Până la 200 invitați' }
    ]
  };

  readonly hall = {
    title: 'Sala Interioară',
    img: IMAGES.hallInterior,
    desc: 'Pentru sezonul rece sau evenimente intime — un spațiu rafinat, climatizat, gata oricând să te primească.'
  };
}
