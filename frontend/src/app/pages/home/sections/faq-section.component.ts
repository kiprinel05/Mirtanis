import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

interface Faq { q: string; a: string; }

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  template: `
    <section class="section bg-cream-50">
      <div class="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <!-- Intro -->
        <div appReveal="left">
          <p class="eyebrow">Întrebări frecvente</p>
          <h2 class="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">Răspundem transparent</h2>
          <p class="mt-5 text-ink-600">
            Am adunat cele mai frecvente întrebări. Dacă nu găsești ce cauți, suntem la un mesaj distanță.
          </p>
          <a routerLink="/contact" class="btn btn-gold mt-8">Întreabă-ne direct</a>
        </div>

        <!-- Accordion -->
        <div class="divide-y divide-cream-300 rounded-3xl border border-cream-300 bg-cream-100"
             appReveal="up" [revealStagger]="70">
          @for (f of faqs; track f.q; let i = $index) {
            <div>
              <button (click)="toggle(i)"
                      class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:text-gold-700"
                      [attr.aria-expanded]="opened() === i">
                <span class="font-display text-lg text-ink-900 sm:text-xl">{{ f.q }}</span>
                <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold-300 text-gold-600 transition-transform duration-300"
                      [class.rotate-45]="opened() === i"><span class="mi text-[20px]">add</span></span>
              </button>
              <div class="grid overflow-hidden transition-all duration-500"
                   [style.grid-template-rows]="opened() === i ? '1fr' : '0fr'">
                <div class="min-h-0">
                  <p class="px-6 pb-6 text-ink-600">{{ f.a }}</p>
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
    { q: 'Care este capacitatea maximă?', a: 'Cortul premium pe lac găzduiește până la 200 de invitați, iar sala interioară până la 100. Putem adapta aranjarea în funcție de numărul vostru.' },
    { q: 'Până la ce oră se poate asculta muzică?', a: 'Programul standard al evenimentelor se întinde până dimineața. Discutăm împreună orarul exact, în funcție de tipul evenimentului și preferințe.' },
    { q: 'Percepeți taxă de dop?', a: 'Politica privind băuturile aduse de client se stabilește la rezervare. Avem și pachete all-inclusive cu băuturi, pentru simplitate.' },
    { q: 'Care este avansul minim pentru rezervare?', a: 'Pentru a bloca o dată în calendar solicităm un avans, restul fiind eșalonat până aproape de eveniment. Detaliile le primești în oferta personalizată.' },
    { q: 'Pot organiza o vizită la locație?', a: 'Absolut. Programează o vizită prin pagina de contact și îți arătăm ambele locații, cu toate detaliile, la fața locului.' },
    { q: 'Oferiți degustare de meniu?', a: 'Da, degustarea este inclusă. Alina vă pune la dispoziție mai multe opțiuni de meniu, pe care le adaptați după preferințe.' }
  ];
}
