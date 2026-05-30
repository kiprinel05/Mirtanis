import { Component } from '@angular/core';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

interface Service { icon: string; title: string; desc: string; }

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section class="section bg-cream-50">
      <div class="container-x">
        <div class="mx-auto max-w-2xl text-center" appReveal="up">
          <p class="eyebrow both">Ce oferim</p>
          <h2 class="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">Tot ce ai nevoie, într-un singur loc</h2>
          <p class="mt-5 text-ink-600">
            De la meniu la coordonare, ne ocupăm de fiecare detaliu ca tu să te bucuri liniștit de eveniment.
          </p>
        </div>

        <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
             appReveal="up" [revealStagger]="90">
          @for (s of services; track s.title) {
            <div class="group rounded-3xl border border-cream-300 bg-cream-100 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-300 hover:bg-cream-50 hover:shadow-card">
              <div class="grid h-14 w-14 place-items-center rounded-2xl bg-gold-100 text-2xl text-gold-600 transition-transform duration-500 group-hover:scale-110">
                <span [innerHTML]="s.icon"></span>
              </div>
              <h3 class="mt-5 font-display text-2xl text-ink-900">{{ s.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-ink-600">{{ s.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class ServicesSectionComponent {
  // Inline SVG icons (stroke = currentColor) — crisp, lightweight, on-brand.
  private icon(path: string): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">${path}</svg>`;
  }

  readonly services: Service[] = [
    { icon: this.icon('<path d="M3 11h18M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M4 11l1 8h14l1-8"/><path d="M9 5V3M15 5V3"/>'),
      title: 'Meniuri personalizate', desc: 'Preparate proaspete, calde, adaptate după preferințele voastre. Degustare inclusă înainte de eveniment.' },
    { icon: this.icon('<path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 21l-4.9-2.6.9-5.5-4-3.9 5.5-.8z"/>'),
      title: 'Decor & aranjamente', desc: 'Decorațiuni de bază incluse, cu opțiuni florale și tematice personalizabile pentru stilul vostru.' },
    { icon: this.icon('<path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a3 3 0 0 1 3-3M19 21v-2a3 3 0 0 0-3-3"/>'),
      title: 'Coordonator dedicat', desc: 'Un coordonator vă însoțește pas cu pas, de la planificare până la ultimul dans.' },
    { icon: this.icon('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 14h4"/>'),
      title: 'Parcare gratuită', desc: 'Spațiu generos de parcare privată pentru toți invitații, cu acces facil la locație.' },
    { icon: this.icon('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'),
      title: 'Sonorizare & lumini', desc: 'Sistem audio-video profesional și iluminat ambiental inclus în ambele locații.' },
    { icon: this.icon('<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6"/>'),
      title: 'Cazare în apropiere', desc: 'Recomandări de cazare partenere, la câțiva pași de locație, pentru invitații de departe.' }
  ];
}
