import { Component } from '@angular/core';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { FloralCornerComponent } from '../../../shared/components/floral-corner.component';

interface Service { icon: string; title: string; desc: string; }

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [RevealDirective, FloralCornerComponent],
  template: `
    <section class="section relative overflow-hidden">
      <app-floral-corner corner="tr" variant="eucalyptus" [size]="200" />
      <app-floral-corner corner="bl" variant="wildflower" [size]="170" />

      <div class="container-x relative">
        <div class="mx-auto max-w-2xl text-center" appReveal="up">
          <p class="eyebrow both">Ce oferim</p>
          <h2 class="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">Totul inclus, <span class="gold-text">fără costuri ascunse</span></h2>
          <div class="leaf-divider mt-6"><span></span><span class="mi text-[18px] text-gold-500">spa</span><span></span></div>
          <p class="mt-5 text-ink-600">
            Ne ocupăm de detaliile importante ca tu să te bucuri liniștit de eveniment — totul transparent, de la meniu la decor.
          </p>
        </div>

        <!-- Mobile: clean horizontal rows. Desktop (sm+): rich card grid. -->
        <div class="mx-auto mt-10 flex max-w-5xl flex-col gap-3 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
             appReveal="up" [revealStagger]="80">
          @for (s of services; track s.title; let i = $index) {
            <div class="svc group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-cream-300/80 bg-cream-50/95 p-4 transition-all duration-500 hover:border-gold-300/70 hover:bg-cream-50 hover:shadow-soft sm:flex-col sm:gap-0 sm:rounded-3xl sm:p-7 sm:hover:-translate-y-2 sm:hover:shadow-card">
              <!-- soft gradient glow on hover (desktop) -->
              <span class="pointer-events-none absolute -right-10 -top-10 hidden h-32 w-32 rounded-full bg-blush-100/60 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 sm:block"></span>
              <!-- faint index number (desktop only) -->
              <span class="pointer-events-none absolute right-5 top-4 hidden font-display text-5xl text-cream-300/70 transition-colors group-hover:text-gold-200/70 sm:block">{{ '0' + (i + 1) }}</span>

              <div class="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-100 text-gold-600 transition-all duration-500 group-hover:bg-gold-500 group-hover:text-cream-50 sm:h-16 sm:w-16 sm:rounded-2xl sm:group-hover:scale-110">
                <span class="mi text-[24px] sm:text-[30px]">{{ s.icon }}</span>
              </div>

              <div class="relative min-w-0 sm:mt-5">
                <h3 class="font-display text-xl leading-tight text-ink-900 sm:text-2xl">{{ s.title }}</h3>
                <p class="mt-1 text-sm leading-relaxed text-ink-600 sm:mt-2">{{ s.desc }}</p>
                <span class="mt-3 hidden h-px w-10 bg-gold-300/60 transition-all duration-500 group-hover:w-20 sm:block"></span>
              </div>
            </div>
          }
        </div>

        <!-- trust strip -->
        <div class="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-full border border-cream-300/70 bg-cream-50/90 px-7 py-4 text-center"
             appReveal="up" [revealDelay]="120">
          @for (t of trust; track t.label) {
            <span class="inline-flex items-center gap-2 text-sm text-ink-700">
              <span class="mi text-[20px] text-gold-600">{{ t.icon }}</span> {{ t.label }}
            </span>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .svc { will-change: transform; }
  `]
})
export class ServicesSectionComponent {
  readonly services: Service[] = [
    { icon: 'savings', title: 'Fără chirie, fără costuri ascunse',
      desc: 'Nu percepem chirie pentru cort sau locație și nu există costuri ascunse — covor roșu, arcadă și restul detaliilor sunt incluse.' },
    { icon: 'restaurant_menu', title: 'Meniuri personalizate',
      desc: 'Preparate proaspete, calde, adaptate după preferințele voastre.' },
    { icon: 'local_bar', title: 'Băutură inclusă în meniu',
      desc: 'În prețul meniului intră băutura, fructele, gheața, alunele și restul — totul, fără surprize.' },
    { icon: 'celebration', title: 'Decor inclus & personalizabil',
      desc: 'Decorațiunile sunt puse la dispoziție în prețul meniului, iar salonul se poate personaliza după dorința voastră.' },
    { icon: 'local_parking', title: 'Spațiu de parcare',
      desc: 'Spațiu generos de parcare pentru invitați, cu acces facil la locație.' },
    { icon: 'nature_people', title: 'Ambient natural pe lac',
      desc: 'Emoția, natura și priveliștea spre lac creează o atmosferă caldă — totul se bazează pe poveste, nu pe opulență.' }
  ];

  readonly trust = [
    { icon: 'verified', label: 'Preț transparent' },
    { icon: 'eco', label: 'Decor natural' },
    { icon: 'favorite', label: 'Echipă dedicată' }
  ];
}
