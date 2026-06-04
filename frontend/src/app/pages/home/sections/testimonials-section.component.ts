import { Component, signal } from '@angular/core';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { FloralCornerComponent } from '../../../shared/components/floral-corner.component';

interface Review { quote: string; opener: string; name: string; meta: string; initial: string; }

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [RevealDirective, FloralCornerComponent],
  template: `
    <section class="section relative">
      <!-- Soft banded backdrop so the section reads as its own space -->
      <div class="pointer-events-none absolute inset-x-0 inset-y-6 overflow-hidden sm:inset-y-10">
        <div class="absolute inset-0 bg-gradient-to-b from-blush-50/80 via-cream-100/90 to-blush-50/70 sm:rounded-[3rem]"></div>
        <div class="absolute inset-0 opacity-[0.5]"
             style="background-image:radial-gradient(40% 50% at 12% 18%, rgba(216,165,147,.18) 0, transparent 60%), radial-gradient(46% 55% at 88% 82%, rgba(233,209,153,.2) 0, transparent 60%);"></div>
        <span class="absolute left-1/2 top-8 h-px w-40 -translate-x-1/2 bg-gold-line"></span>
        <span class="absolute bottom-8 left-1/2 h-px w-40 -translate-x-1/2 bg-gold-line"></span>
      </div>

      <app-floral-corner corner="tl" variant="rose" [size]="190" />
      <app-floral-corner corner="br" variant="eucalyptus" [size]="190" />

      <div class="container-x relative py-6 sm:py-12">
        <!-- Header + trust badge -->
        <div class="mx-auto max-w-2xl text-center" appReveal="up">
          <p class="eyebrow both">Recenzii reale</p>
          <h2 class="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">Ce spun <span class="gold-text">invitații noștri</span></h2>

          <div class="mt-7 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-full border border-cream-300 bg-cream-50/95 px-6 py-3 shadow-soft">
            <span class="flex items-center gap-0.5 text-gold-500" aria-label="5 din 5 stele">
              @for (s of stars; track $index) { <span class="mi fill text-[18px]">star</span> }
            </span>
            <span class="text-sm font-semibold text-ink-800">98% recomandă</span>
            <span class="hidden h-4 w-px bg-cream-400 sm:block"></span>
            <a href="https://www.facebook.com/mirtanisevents/" target="_blank" rel="noopener"
               class="inline-flex items-center gap-1.5 text-sm text-ink-600 transition-colors hover:text-[#1877F2]">
              <span class="grid h-5 w-5 place-items-center rounded bg-[#1877F2] text-[11px] font-bold text-white">f</span>
              33 recenzii pe Facebook
            </a>
          </div>
        </div>

        <div class="mt-14 grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-stretch">
          <!-- Featured card -->
          <article class="card relative flex min-h-[27rem] flex-col p-8 sm:min-h-[24rem] sm:p-10" appReveal="up">
            <!-- big quote mark -->
            <span class="pointer-events-none absolute right-8 top-2 font-display text-[7rem] leading-none text-gold-200/70">”</span>

            <div class="flex items-center gap-0.5 text-gold-500">
              @for (s of stars; track $index) { <span class="mi fill text-[20px]">star</span> }
            </div>

            <p class="mt-5 font-display text-2xl italic leading-snug text-ink-900 sm:text-3xl">“{{ featured[active()].opener }}”</p>
            <p class="mt-4 flex-1 leading-relaxed text-ink-600">{{ featured[active()].quote }}</p>

            <div class="mt-7 flex items-center justify-between border-t border-cream-300 pt-5">
              <div class="flex items-center gap-3">
                <span class="grid h-12 w-12 place-items-center rounded-full bg-gold-grad font-display text-lg text-[#2a1f0e] shadow-soft">{{ featured[active()].initial }}</span>
                <div>
                  <p class="font-display text-lg text-ink-900">{{ featured[active()].name }}</p>
                  <p class="text-xs uppercase tracking-widest2 text-gold-600">{{ featured[active()].meta }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <!-- dots -->
                <div class="hidden items-center gap-1.5 sm:flex">
                  @for (f of featured; track $index) {
                    <button (click)="active.set($index)" [attr.aria-label]="'Recenzia ' + ($index + 1)"
                            class="h-2 rounded-full transition-all duration-300"
                            [style.width.px]="active() === $index ? 22 : 8"
                            [style.background]="active() === $index ? '#BB8E3C' : '#E7DAC4'"></button>
                  }
                </div>
                <button (click)="prev()" aria-label="Anterioara"
                        class="grid h-10 w-10 place-items-center rounded-full border border-cream-400 text-ink-700 transition hover:border-gold-400 hover:bg-gold-50 hover:text-gold-600"><span class="mi text-[22px]">chevron_left</span></button>
                <button (click)="next()" aria-label="Următoarea"
                        class="grid h-10 w-10 place-items-center rounded-full border border-cream-400 text-ink-700 transition hover:border-gold-400 hover:bg-gold-50 hover:text-gold-600"><span class="mi text-[22px]">chevron_right</span></button>
              </div>
            </div>
          </article>

          <!-- Side list of shorter reviews -->
          <div class="grid gap-4" appReveal="right" [revealStagger]="90">
            @for (r of shorts; track r.name) {
              <div class="group relative overflow-hidden rounded-3xl border border-cream-300 bg-cream-50/95 p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-gold-300 hover:shadow-card">
                <span class="pointer-events-none absolute -right-2 -top-3 font-display text-6xl text-gold-100 transition-colors group-hover:text-gold-200">”</span>
                <div class="relative flex items-center gap-0.5 text-gold-500">
                  @for (s of stars; track $index) { <span class="mi fill text-[15px]">star</span> }
                </div>
                <p class="relative mt-3 font-display text-lg text-ink-800">{{ r.quote }}</p>
                <div class="relative mt-4 flex items-center gap-3">
                  <span class="grid h-9 w-9 place-items-center rounded-full bg-gold-100 font-display text-sm text-gold-700">{{ r.initial }}</span>
                  <p class="text-sm font-medium text-ink-800">{{ r.name }}</p>
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
