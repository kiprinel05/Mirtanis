import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ParallaxDirective } from '../../shared/directives/parallax.directive';

interface Venue {
  name: string;
  tag: string;
  intro: string;
  long: string;
  capacity: string;
  features: string[];
  gallery: string[];
}

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective, ParallaxDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pt-40 pb-16">
      <div class="container-luxe px-6 max-w-5xl">
        <span class="eyebrow">Locațiile noastre</span>
        <h1 class="mt-4 font-display text-5xl md:text-7xl text-white">Două lumi, <span class="gold-text">o singură poveste</span>.</h1>
        <p class="mt-6 text-white/70 max-w-2xl text-lg">Cortul premium pentru momente cinematice deasupra apei, sala interioară pentru eleganță rafinată în orice anotimp.</p>
      </div>
    </section>

    <section *ngFor="let v of venues; let i = index" class="section relative" [class.bg-ink-900]="i % 2 === 1">
      <div class="container-luxe grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div class="lg:col-span-5 order-2"
             [ngClass]="i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'">
          <span appReveal class="eyebrow">{{ v.tag }}</span>
          <h2 appReveal [revealDelay]="100" class="mt-5 font-display text-4xl md:text-6xl text-white leading-[1.05]">{{ v.name }}</h2>
          <p appReveal [revealDelay]="200" class="mt-5 text-gold-200 italic font-display text-2xl">{{ v.intro }}</p>
          <div appReveal [revealDelay]="300" class="divider-gold w-20 mt-7"></div>
          <p appReveal [revealDelay]="350" class="mt-7 text-white/75 leading-relaxed">{{ v.long }}</p>

          <ul appReveal [revealDelay]="450" class="mt-8 flex flex-wrap gap-2">
            <li *ngFor="let f of v.features" class="text-xs tracking-wider uppercase text-white/80 border border-white/10 rounded-full px-3 py-1.5">{{ f }}</li>
          </ul>

          <div appReveal [revealDelay]="550" class="mt-10 flex items-center gap-6">
            <div>
              <p class="eyebrow text-[10px]">Capacitate</p>
              <p class="font-display text-3xl gold-text">{{ v.capacity }}</p>
            </div>
            <a routerLink="/rezervari" class="btn btn-primary">Verifică data</a>
          </div>
        </div>

        <div class="lg:col-span-7 relative h-[520px] md:h-[620px] order-1"
             [ngClass]="i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'">
          <div appParallax [parallaxFactor]="0.06" class="absolute top-0 right-0 w-3/4 h-3/4 img-cine shadow-glass">
            <img [src]="v.gallery[0]" [alt]="v.name" loading="lazy" class="w-full h-full object-cover"/>
          </div>
          <div appParallax [parallaxFactor]="-0.05" class="absolute bottom-0 left-0 w-1/2 h-1/2 img-cine shadow-glass border border-gold-400/20">
            <img [src]="v.gallery[1]" [alt]="v.name" loading="lazy" class="w-full h-full object-cover"/>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LocationsComponent {
  readonly venues: Venue[] = [
    {
      name: 'Cortul Premium',
      tag: 'Atracția principală',
      intro: 'Panoramic, cinematic, peste apă.',
      long:
        'Cortul nostru este principala atracție a complexului. Construit pe ponton, cu vedere completă spre lac, oferă o experiență cinematică indiferent de moment — soare blând la prânz, lumini calde la apus, lampioane reflectate pe apă noaptea. Plafonul înalt, decorul rafinat și acustica gândită fac din el alegerea perfectă pentru nunți de top.',
      capacity: '60 – 350 invitați',
      features: ['Vedere panoramică', 'Iluminare ambientală', 'Ring central', 'Acces direct ponton', 'Aer condiționat', 'Backstage privat'],
      gallery: [
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1490578474895-699cd4e2cf5b?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      name: 'Sala Interioară',
      tag: 'Eleganță atemporală',
      intro: 'Caldă, rafinată, intimă.',
      long:
        'Sala interioară este completarea perfectă pentru cort. Cu finisaje elegante, lumini ambientale și o ambianță caldă, este spațiul ideal pentru botezuri, cununii civile, aniversări și petreceri private — în orice anotimp.',
      capacity: '40 – 180 invitați',
      features: ['Ambianță intimă', 'Ring de dans', 'Lounge bar', 'Foișor terasă', 'Climatizare', 'Acustică premium'],
      gallery: [
        'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80'
      ]
    }
  ];
}
