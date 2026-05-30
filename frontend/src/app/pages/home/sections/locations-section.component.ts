import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { IMAGES } from '../../../shared/data/images';

@Component({
  selector: 'app-locations-section',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  template: `
    <section class="section">
      <div class="container-x">
        <div class="mx-auto max-w-2xl text-center" appReveal="up">
          <p class="eyebrow both">Locațiile noastre</p>
          <h2 class="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">Două decoruri, o singură poveste</h2>
          <p class="mt-5 text-ink-600">
            Alege cadrul potrivit pentru ziua ta — sub cerul liber, lângă apă, sau în eleganța caldă a sălii interioare.
          </p>
        </div>

        <div class="mt-16 grid gap-8 lg:grid-cols-2">
          @for (v of venues; track v.title; let i = $index) {
            <article appReveal="up" [revealDelay]="i * 150"
                     class="group hover-lift relative overflow-hidden rounded-4xl shadow-card">
              <div class="img-cine aspect-[4/3]">
                <img [src]="v.img" [alt]="v.title" loading="lazy" />
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-ink-900/92 from-15% via-ink-900/45 via-50% to-transparent"></div>
              <div class="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <p class="text-xs font-medium uppercase tracking-widest2 text-gold-200">{{ v.tag }}</p>
                <h3 class="mt-2 font-display text-3xl text-cream-50 sm:text-4xl" style="text-shadow:0 2px 16px rgba(0,0,0,.4)">{{ v.title }}</h3>
                <p class="mt-2 max-w-md text-sm text-cream-50/90">{{ v.desc }}</p>
                <a routerLink="/locatii"
                   class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold-200 transition-all group-hover:gap-3">
                  Detalii <span>→</span>
                </a>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `
})
export class LocationsSectionComponent {
  readonly venues = [
    {
      title: 'Cort Premium pe Lac',
      tag: 'În aer liber',
      img: IMAGES.tentExterior,
      desc: 'Structură elegantă cu pereți transparenți, lumini calde și vedere panoramică spre apă — magie sub stele.'
    },
    {
      title: 'Sala Interioară',
      tag: 'Eleganță all-season',
      img: IMAGES.hallInterior,
      desc: 'Spațiu rafinat, climatizat, cu tavane înalte și detalii aurii — perfect în orice anotimp.'
    }
  ];
}
