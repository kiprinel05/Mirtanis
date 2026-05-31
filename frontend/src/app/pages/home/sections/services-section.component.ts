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
            Ne ocupăm de detaliile importante ca tu să te bucuri liniștit de eveniment.
          </p>
        </div>

        <div class="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
             appReveal="up" [revealStagger]="90">
          @for (s of services; track s.title) {
            <div class="group rounded-3xl border border-cream-300 bg-cream-100 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-300 hover:bg-cream-50 hover:shadow-card">
              <div class="grid h-14 w-14 place-items-center rounded-2xl bg-gold-100 text-gold-600 transition-transform duration-500 group-hover:scale-110">
                <span class="mi text-[28px]">{{ s.icon }}</span>
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
  readonly services: Service[] = [
    { icon: 'restaurant_menu', title: 'Meniuri personalizate', desc: 'Preparate proaspete, calde, adaptate după preferințele voastre.' },
    { icon: 'palette', title: 'Decor în culorile voastre', desc: 'Decor adaptat cromaticii alese de voi, pentru o atmosferă pe gustul vostru.' },
    { icon: 'local_parking', title: 'Spațiu de parcare', desc: 'Spațiu generos de parcare pentru invitați, cu acces facil la locație.' }
  ];
}
