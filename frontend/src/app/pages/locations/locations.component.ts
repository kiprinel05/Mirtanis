import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { IMAGES } from '../../shared/data/images';

interface Venue {
  tag: string;
  title: string;
  capacity: string;
  desc: string;
  features: string[];
  images: string[];
}

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, RevealDirective],
  template: `
    <app-page-header
      eyebrow="Locațiile noastre"
      title="Două decoruri de poveste"
      subtitle="Alege cadrul perfect pentru evenimentul tău — sub cerul liber lângă lac, sau în eleganța caldă a sălii interioare."
      [image]="headerImg" />

    <div class="section">
      <div class="container-x space-y-24 lg:space-y-36">
        @for (v of venues; track v.title; let i = $index) {
          <article class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <!-- Images -->
            <div class="order-1" [class.lg:order-2]="i % 2 === 1" appReveal="up">
              <div class="img-cine gold-frame hover-lift relative aspect-[4/3] rounded-3xl shadow-card">
                <img [src]="v.images[0]" [alt]="v.title" loading="lazy" />
                <span class="absolute left-4 top-4 z-[3] rounded-full bg-cream-50/95 px-4 py-1.5 text-xs font-medium uppercase tracking-widest2 text-gold-700 shadow-soft">{{ v.capacity }}</span>
              </div>
              <div class="mt-4 grid grid-cols-2 gap-4">
                <div class="img-cine aspect-[4/3] rounded-2xl shadow-soft">
                  <img [src]="v.images[1]" [alt]="v.title" loading="lazy" />
                </div>
                <div class="img-cine aspect-[4/3] rounded-2xl shadow-soft">
                  <img [src]="v.images[2]" [alt]="v.title" loading="lazy" />
                </div>
              </div>
            </div>

            <!-- Text -->
            <div class="order-2" [class.lg:order-1]="i % 2 === 1" appReveal="up" [revealDelay]="120">
              <p class="eyebrow">{{ v.tag }}</p>
              <h2 class="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">{{ v.title }}</h2>
              <p class="mt-5 text-lg leading-relaxed text-ink-600">{{ v.desc }}</p>
              <ul class="mt-8 grid gap-3 sm:grid-cols-2" appReveal="up" [revealStagger]="70" [revealDelay]="150">
                @for (f of v.features; track f) {
                  <li class="flex items-center gap-3 text-ink-700">
                    <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage-100 text-sage-600"><span class="mi text-[15px]">check</span></span>
                    {{ f }}
                  </li>
                }
              </ul>
              <a routerLink="/rezervari" class="btn btn-gold mt-10">Verifică disponibilitatea</a>
            </div>
          </article>
        }
      </div>
    </div>

    <!-- Mini CTA -->
    <section class="section pt-0">
      <div class="container-x">
        <div class="card flex flex-col items-center gap-5 px-7 py-12 text-center sm:px-12">
          <p class="script text-3xl">Vino să vezi cu ochii tăi</p>
          <h3 class="font-display text-3xl text-ink-900 sm:text-4xl">Programează o vizită la locație</h3>
          <a routerLink="/contact" class="btn btn-outline">Contactează-ne</a>
        </div>
      </div>
    </section>
  `
})
export class LocationsComponent {
  readonly headerImg = IMAGES.tentExterior;
  readonly venues: Venue[] = [
    {
      tag: 'În aer liber · pe lac',
      title: 'Cort Premium pe Lac',
      capacity: 'Până la 200 invitați',
      desc: 'Un cort elegant cu pereți transparenți, deschis către apă și cer. Ziua, lumina naturală se revarsă înăuntru; seara, ghirlandele aurii transformă totul într-un decor de basm.',
      features: [
        'Capacitate până la 200 de invitați',
        'Vedere panoramică spre lac',
        'Ring de dans și scenă',
        'Iluminat ambiental & ghirlande',
        'Acces direct la ponton',
        'Climatizare pentru sezonul cald'
      ],
      images: [IMAGES.tentExterior, IMAGES.ceremonyChairs, IMAGES.stringLights]
    },
    {
      tag: 'Eleganță all-season',
      title: 'Sala Interioară',
      capacity: 'Până la 100 invitați',
      desc: 'Un spațiu rafinat, cu tavane înalte, candelabre și detalii aurii. Perfect climatizat, este alegerea ideală pentru orice anotimp și pentru evenimente intime, deopotrivă.',
      features: [
        'Capacitate până la 100 de invitați',
        'Climatizare completă',
        'Sistem audio-video profesional',
        'Lounge & zonă de protocol',
        'Bucătărie proprie',
        'Decor personalizabil'
      ],
      images: [IMAGES.hallInterior, IMAGES.tentInterior, IMAGES.champagne]
    }
  ];
}
