import { Component, signal } from '@angular/core';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

interface Review { quote: string; opener: string; name: string; meta: string; initial: string; }

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section class="relative overflow-hidden bg-sage-700 py-20 text-cream-50 sm:py-28 lg:py-32">
      <!-- soft texture -->
      <div class="pointer-events-none absolute inset-0 opacity-[0.05]"
           style="background-image:radial-gradient(circle at 15% 20%, #fff 0, transparent 38%), radial-gradient(circle at 85% 70%, #fff 0, transparent 34%);"></div>

      <div class="container-x relative">
        <!-- Header + trust badge -->
        <div class="mx-auto max-w-2xl text-center" appReveal="up">
          <p class="eyebrow both !text-gold-200">Recenzii reale</p>
          <h2 class="mt-4 font-display text-4xl text-cream-50 sm:text-5xl">Ce spun invitații noștri</h2>

          <div class="mt-7 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-full border border-cream-50/20 bg-cream-50/10 px-6 py-3 backdrop-blur-sm">
            <span class="flex items-center gap-0.5 text-gold-200" aria-label="5 din 5 stele">
              @for (s of stars; track $index) { <span>★</span> }
            </span>
            <span class="text-sm font-semibold">98% recomandă</span>
            <span class="hidden h-4 w-px bg-cream-50/30 sm:block"></span>
            <span class="inline-flex items-center gap-1.5 text-sm text-cream-100/80">
              <span class="grid h-5 w-5 place-items-center rounded bg-[#1877F2] text-[11px] font-bold text-white">f</span>
              33 recenzii pe Facebook
            </span>
          </div>
        </div>

        <div class="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-stretch">
          <!-- Featured card -->
          <article class="relative flex flex-col rounded-4xl bg-cream-50 p-8 text-ink-700 shadow-card sm:p-10" appReveal="left">
            <span class="pointer-events-none absolute right-8 top-4 font-display text-8xl leading-none text-gold-200">”</span>

            <div class="flex items-center gap-1 text-gold-500">
              @for (s of stars; track $index) { <span>★</span> }
            </div>

            <!-- short italic opener, then clean body -->
            <p class="mt-5 font-display text-2xl italic text-ink-900 sm:text-3xl">“{{ featured[active()].opener }}”</p>
            <p class="mt-4 flex-1 leading-relaxed text-ink-600">{{ featured[active()].quote }}</p>

            <div class="mt-7 flex items-center justify-between border-t border-cream-300 pt-5">
              <div class="flex items-center gap-3">
                <span class="grid h-11 w-11 place-items-center rounded-full bg-gold-100 font-display text-lg text-gold-700">{{ featured[active()].initial }}</span>
                <div>
                  <p class="font-display text-lg text-ink-900">{{ featured[active()].name }}</p>
                  <p class="text-xs uppercase tracking-widest2 text-gold-600">{{ featured[active()].meta }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button (click)="prev()" aria-label="Anterioara"
                        class="grid h-10 w-10 place-items-center rounded-full border border-cream-400 text-ink-700 transition hover:border-gold-400 hover:text-gold-600">‹</button>
                <button (click)="next()" aria-label="Următoarea"
                        class="grid h-10 w-10 place-items-center rounded-full border border-cream-400 text-ink-700 transition hover:border-gold-400 hover:text-gold-600">›</button>
              </div>
            </div>
          </article>

          <!-- Side list of shorter reviews -->
          <div class="grid gap-4" appReveal="right" [revealStagger]="90">
            @for (r of shorts; track r.name) {
              <div class="rounded-3xl border border-cream-50/15 bg-cream-50/10 p-6 backdrop-blur-sm transition-colors hover:bg-cream-50/15">
                <div class="flex items-center gap-1 text-gold-200">
                  @for (s of stars; track $index) { <span class="text-sm">★</span> }
                </div>
                <p class="mt-3 text-cream-50">{{ r.quote }}</p>
                <div class="mt-4 flex items-center gap-3">
                  <span class="grid h-9 w-9 place-items-center rounded-full bg-cream-50/15 font-display text-sm">{{ r.initial }}</span>
                  <div>
                    <p class="text-sm font-medium text-cream-50">{{ r.name }}</p>
                    <p class="text-[11px] uppercase tracking-widest2 text-cream-100/60">{{ r.meta }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `
})
export class TestimonialsSectionComponent {
  readonly stars = [1, 2, 3, 4, 5];
  readonly active = signal(0);

  readonly featured: Review[] = [
    {
      opener: 'Lacul creează un loc inedit pentru voi și invitați.',
      quote: 'Recomand tuturor celor care vor să-și organizeze evenimentul într-un ambient plăcut. Am ales Mirtanis Events pentru cununia civilă. Mâncarea a fost foarte bună, caldă și proaspăt făcută; Alina vă pune la dispoziție mai multe opțiuni de meniu, adaptate după preferințe. Ospătarii sunt prompți și bine instruiți, iar invitații s-au simțit minunat. Vom reveni cu drag!',
      name: 'Ramona Barbu', meta: 'Cununie civilă', initial: 'R'
    },
    {
      opener: 'Servicii extraordinare, ideale pentru momente de neuitat.',
      quote: 'Recomand din toată inima! Personal amabil și bine pregătit, locație superbă. A fost exact cum ne-am dorit, iar totul a decurs impecabil de la început până la sfârșit. Vă mulțumim!',
      name: 'Andreea Lazăr', meta: 'Eveniment privat', initial: 'A'
    },
    {
      opener: 'O locație perfectă pentru evenimente.',
      quote: 'Am cântat aici și am rămas plăcut impresionați. Cadrul este superb, iar organizarea ireproșabilă. Sperăm să mai avem ocazia să revenim. Felicitări celor care administrează această locație de evenimente!',
      name: 'Leu Adrian', meta: 'Artist / Formație', initial: 'L'
    }
  ];

  readonly shorts: Review[] = [
    { opener: '', quote: 'Locație superbă! Recomand cu încredere oricui.', name: 'Cristina Tînjală', meta: 'Invitat', initial: 'C' },
    { opener: '', quote: '5 stele — o experiență de neuitat.', name: 'Cătălin Grigoraș', meta: 'Invitat', initial: 'C' },
    { opener: '', quote: 'Superb! Totul a fost peste așteptări.', name: 'Denisa Lucan', meta: 'Invitat', initial: 'D' }
  ];

  next(): void { this.active.update((v) => (v + 1) % this.featured.length); }
  prev(): void { this.active.update((v) => (v - 1 + this.featured.length) % this.featured.length); }
}
