import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { FloralCornerComponent } from '../../../shared/components/floral-corner.component';

interface Faq { q: string; a: string; icon: string; }

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [RouterLink, RevealDirective, FloralCornerComponent],
  template: `
    <section class="section relative overflow-hidden">
      <app-floral-corner corner="tr" variant="wildflower" [size]="200" />
      <app-floral-corner corner="bl" variant="eucalyptus" [size]="170" />

      <div class="container-x relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <!-- ===== Intro / sticky panel ===== -->
        <div appReveal="left" class="lg:sticky lg:top-28 lg:self-start">
          <div class="grid h-14 w-14 place-items-center rounded-2xl bg-gold-100 text-gold-600 shadow-soft">
            <span class="mi text-[28px]">contact_support</span>
          </div>
          <p class="eyebrow mt-6">Întrebări frecvente</p>
          <h2 class="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">Răspundem <span class="gold-text">transparent</span></h2>
          <p class="mt-5 text-ink-600">
            Am adunat cele mai frecvente întrebări. Dacă nu găsești răspunsul căutat, suntem la un mesaj distanță.
          </p>

          <!-- quick contact card -->
          <div class="mt-8 rounded-3xl border border-cream-300/80 bg-cream-50/80 p-6 backdrop-blur-sm shadow-soft">
            <p class="text-sm text-ink-600">Ai o întrebare specifică?</p>
            <a href="tel:+407XXXXXXXX" class="mt-2 flex items-center gap-3 font-display text-2xl text-ink-900 transition-colors hover:text-gold-700">
              <span class="grid h-9 w-9 place-items-center rounded-full bg-gold-500 text-cream-50"><span class="mi text-[18px]">call</span></span>
              +40 7XX XXX XXX
            </a>
            <a routerLink="/contact" class="btn btn-gold mt-5 w-full">Întreabă-ne direct</a>
          </div>
        </div>

        <!-- ===== Accordion ===== -->
        <div class="space-y-3" appReveal="up" [revealStagger]="70">
          @for (f of faqs; track f.q; let i = $index) {
            <div class="faq-item overflow-hidden rounded-2xl border bg-cream-50/75 backdrop-blur-sm transition-all duration-300"
                 [class.border-gold-300]="opened() === i"
                 [class.border-cream-300]="opened() !== i"
                 [class.shadow-soft]="opened() === i">
              <button (click)="toggle(i)"
                      class="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                      [attr.aria-expanded]="opened() === i">
                <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors duration-300"
                      [class.bg-gold-500]="opened() === i" [class.text-cream-50]="opened() === i"
                      [class.bg-gold-100]="opened() !== i" [class.text-gold-600]="opened() !== i">
                  <span class="mi text-[20px]">{{ f.icon }}</span>
                </span>
                <span class="flex-1 font-display text-lg text-ink-900 sm:text-xl">{{ f.q }}</span>
                <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold-300 text-gold-600 transition-transform duration-300"
                      [class.rotate-45]="opened() === i"><span class="mi text-[18px]">add</span></span>
              </button>
              <div class="grid transition-all duration-500" [style.grid-template-rows]="opened() === i ? '1fr' : '0fr'">
                <div class="overflow-hidden">
                  <p class="px-5 pb-5 pl-[4.75rem] text-ink-600 sm:px-6 sm:pb-6 sm:pl-[5rem]">{{ f.a }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class FaqSectionComponent {
  readonly opened = signal<number | null>(0);
  toggle(i: number): void { this.opened.update((v) => (v === i ? null : i)); }

  readonly faqs: Faq[] = [
    { icon: 'groups', q: 'Care este capacitatea maximă?', a: 'Cortul premium pe lac găzduiește până la 200 de invitați, iar sala interioară până la 100. Putem adapta aranjarea în funcție de numărul vostru.' },
    { icon: 'music_note', q: 'Până la ce oră se poate asculta muzică?', a: 'Programul standard al evenimentelor se întinde până dimineața. Discutăm împreună orarul exact, în funcție de tipul evenimentului și preferințe.' },
    { icon: 'savings', q: 'Există costuri ascunse sau chirie?', a: 'Nu. Nu percepem chirie pentru cort sau locație și nu există costuri ascunse. Băutura, fructele, gheața, decorul și detaliile precum covorul roșu sau arcada sunt incluse în prețul meniului.' },
    { icon: 'payments', q: 'Cum se face plata și avansul?', a: 'Avansul se achită la începutul evenimentului, iar plata integrală se face la sfârșitul acestuia. Detaliile complete le primești în oferta personalizată.' },
    { icon: 'event_available', q: 'Pot organiza o vizită la locație?', a: 'Absolut. Programează o vizită prin pagina de contact și îți arătăm ambele locații, cu toate detaliile, la fața locului.' },
    { icon: 'restaurant', q: 'Oferiți degustare de meniu?', a: 'Da, degustarea este inclusă și se poate face în orice zi în care avem un eveniment programat. Vă punem la dispoziție mai multe opțiuni de meniu, pe care le adaptați după preferințe.' }
  ];
}
