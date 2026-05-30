import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

interface Venue {
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  capacity: string;
  features: string[];
}

@Component({
  selector: 'app-locations-section',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section relative" id="locatii">
      <div class="container-luxe">
        <div class="max-w-3xl">
          <span appReveal class="eyebrow">Cele două locații</span>
          <h2 appReveal [revealDelay]="100" class="mt-5 font-display text-4xl md:text-6xl text-white leading-[1.05]">
            Două spații, <span class="gold-text">o singură poveste</span>.
          </h2>
          <p appReveal [revealDelay]="200" class="mt-6 text-white/70 text-lg leading-relaxed">
            Indiferent de anotimp, indiferent de stil — alegi cortul premium cu vedere panoramică
            spre apă sau sala interioară elegantă, calmă și rafinată.
          </p>
        </div>

        <div class="mt-16 grid lg:grid-cols-2 gap-8">
          <article *ngFor="let v of venues; let i = index" appReveal [revealDelay]="i * 150"
                   class="group relative overflow-hidden rounded-3xl glass-dark border border-white/5 hover:border-gold-400/40 transition-all duration-700">
            <div class="relative h-[420px] overflow-hidden">
              <img [src]="v.image" [alt]="v.title" loading="lazy"
                   class="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110 saturate-[0.95] group-hover:saturate-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent"></div>
              <span class="absolute top-5 left-5 eyebrow bg-ink-950/60 backdrop-blur px-3 py-1.5 rounded-full">{{ v.tag }}</span>
            </div>

            <div class="p-8 md:p-10">
              <h3 class="font-display text-3xl md:text-4xl text-white">{{ v.title }}</h3>
              <p class="mt-2 text-gold-300 italic font-display text-xl">{{ v.subtitle }}</p>
              <p class="mt-5 text-white/70 leading-relaxed">{{ v.desc }}</p>

              <ul class="mt-6 flex flex-wrap gap-2">
                <li *ngFor="let f of v.features" class="text-xs tracking-wider uppercase text-white/80 border border-white/10 rounded-full px-3 py-1.5">
                  {{ f }}
                </li>
              </ul>

              <div class="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                <div>
                  <p class="eyebrow text-[10px]">Capacitate</p>
                  <p class="font-display text-2xl gold-text">{{ v.capacity }}</p>
                </div>
                <a routerLink="/locatii" class="btn btn-ghost">Detalii</a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `
})
export class LocationsSectionComponent {
  readonly venues: Venue[] = [
    {
      tag: 'Atracția principală',
      title: 'Cortul Premium',
      subtitle: 'Panoramic, deasupra apei',
      desc:
        'Un cort elegant cu vedere completă spre lac, iluminat cald pentru atmosfera de seară. Plafon înalt, decor luxos, cinematografic — locul ideal pentru nunți de top și evenimente memorabile.',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80',
      capacity: '60 – 350 invitați',
      features: ['Vedere panoramică', 'Iluminare warm', 'Ring central', 'Acces ponton', 'Aer condiționat']
    },
    {
      tag: 'Eleganță interioară',
      title: 'Sala Interioară',
      subtitle: 'Rafinată și caldă',
      desc:
        'Un spațiu interior elegant, cu finisaje rafinate, perfect pentru evenimente mai intime — botezuri, cununii civile, aniversări și petreceri private în orice anotimp.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=80',
      capacity: '40 – 180 invitați',
      features: ['Ambianță intimă', 'Ring de dans', 'Lounge bar', 'Foișor terasă', 'Climatizare']
    }
  ];
}
