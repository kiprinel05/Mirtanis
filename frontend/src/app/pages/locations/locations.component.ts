import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { FloralCornerComponent } from '../../shared/components/floral-corner.component';
import { IMAGES } from '../../shared/data/images';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, RevealDirective, FloralCornerComponent],
  template: `
    <app-page-header
      eyebrow="Locația noastră"
      title="Cortul de pe malul lacului"
      subtitle="Inima Mirtanis Events — un cort de poveste, deschis spre apă și cer. Iar pentru sezonul rece, sala interioară te așteaptă."
      [image]="headerImg" />

    <!-- ===== TENT — the star ===== -->
    <section class="section relative overflow-hidden">
      <app-floral-corner corner="tl" [size]="200" />
      <app-floral-corner corner="br" [size]="200" />

      <div class="container-x relative">
        <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <!-- Images -->
          <div appReveal="left">
            <div class="img-cine gold-frame hover-lift relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
              <img [src]="tent.images[0]" [alt]="tent.title" loading="lazy" />
              <span class="absolute left-4 top-4 z-[3] inline-flex items-center gap-1.5 rounded-full bg-gold-500/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest2 text-[#2a1f0e] shadow-soft">
                <span class="mi text-[15px]">star</span> Atracția principală
              </span>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4">
              <div class="img-cine aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
                <img [src]="tent.images[1]" [alt]="tent.title" loading="lazy" />
              </div>
              <div class="img-cine aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
                <img [src]="tent.images[2]" [alt]="tent.title" loading="lazy" />
              </div>
            </div>
          </div>

          <!-- Text -->
          <div appReveal="right" [revealDelay]="120">
            <p class="eyebrow">{{ tent.tag }}</p>
            <h2 class="mt-4 font-display text-4xl text-ink-900 sm:text-5xl lg:text-6xl">{{ tent.title }}</h2>
            <p class="mt-5 text-lg leading-relaxed text-ink-600">{{ tent.desc }}</p>
            <ul class="mt-8 grid gap-3 sm:grid-cols-2" appReveal="up" [revealStagger]="70" [revealDelay]="150">
              @for (f of tent.features; track f) {
                <li class="flex items-center gap-3 text-ink-700">
                  <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-600"><span class="mi text-[15px]">check</span></span>
                  {{ f }}
                </li>
              }
            </ul>
            <a routerLink="/rezervari" class="btn btn-gold mt-10">Verifică disponibilitatea</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== HALL — alternative, compact ===== -->
    <section class="section relative pt-0">
      <div class="container-x">
        <div class="mx-auto mb-12 max-w-2xl text-center" appReveal="up">
          <p class="eyebrow both">Pentru sezonul rece</p>
          <h2 class="mt-4 font-display text-3xl text-ink-900 sm:text-4xl">O alternativă caldă, oricând</h2>
        </div>

        <div class="card grid items-center gap-8 overflow-hidden p-0 lg:grid-cols-2" appReveal="up">
          <div class="img-cine h-full min-h-[280px] overflow-hidden">
            <img [src]="hall.images[0]" [alt]="hall.title" class="h-full w-full object-cover" loading="lazy" />
          </div>
          <div class="p-7 sm:p-10">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-[10px] font-medium uppercase tracking-widest2 text-sage-600">
              <span class="mi text-[14px]">ac_unit</span> All-season · {{ hall.capacity }}
            </span>
            <h3 class="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">{{ hall.title }}</h3>
            <p class="mt-4 leading-relaxed text-ink-600">{{ hall.desc }}</p>
            <ul class="mt-6 flex flex-wrap gap-2">
              @for (f of hall.features; track f) {
                <li class="inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-3 py-1.5 text-xs text-ink-700">
                  <span class="mi text-[14px] text-sage-600">check</span> {{ f }}
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Mini CTA -->
    <section class="section pt-0">
      <div class="container-x">
        <div class="relative overflow-hidden rounded-4xl shadow-card" appReveal="scale">
          <img [src]="ctaImg" alt="Lac la apus" class="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div class="absolute inset-0 bg-sage-700/80"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-sage-700 via-sage-700/70 to-sage-700/55"></div>
          <div class="relative flex flex-col items-center gap-4 px-7 py-16 text-center text-cream-50 sm:px-12 sm:py-20" style="text-shadow:0 2px 18px rgba(20,30,15,.5)">
            <p class="script text-3xl !text-gold-200 sm:text-4xl">Vino să vezi cu ochii tăi</p>
            <h3 class="font-display text-3xl text-cream-50 sm:text-4xl lg:text-5xl">Programează o vizită la cort</h3>
            <p class="max-w-md text-cream-100/85">Te așteptăm pe malul lacului să descoperi locul unde povestea ta prinde viață.</p>
            <div class="mt-4 flex flex-col gap-3 sm:flex-row">
              <a routerLink="/contact" class="btn btn-gold">Contactează-ne</a>
              <a routerLink="/rezervari" class="btn btn-outline !border-cream-100/60 !text-cream-50 hover:!bg-cream-50/10">Verifică disponibilitatea</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LocationsComponent {
  readonly headerImg = IMAGES.tentExterior;
  readonly ctaImg = IMAGES.lakeSunset;

  readonly tent = {
    tag: 'În aer liber · pe malul lacului',
    title: 'Cort Premium pe Lac',
    desc: 'Atracția noastră principală: un cort elegant cu pereți transparenți, deschis către apă și cer. Ziua, lumina naturală se revarsă înăuntru; seara, ghirlandele aurii și apusul peste lac transformă totul într-un decor de basm. Aici natura este vedeta.',
    features: [
      'Capacitate până la 200 de invitați',
      'Vedere panoramică spre lac',
      'Ring de dans și scenă',
      'Iluminat ambiental & ghirlande',
      'Acces direct la ponton',
      'Climatizare pentru sezonul cald'
    ],
    images: [IMAGES.tentExterior, IMAGES.ceremonyChairs, IMAGES.stringLights]
  };

  readonly hall = {
    title: 'Sala Interioară',
    capacity: 'până la 100 invitați',
    desc: 'Pe timpul iernii, când cortul nu este potrivit, sala interioară este alegerea caldă și sigură — un spațiu intim, climatizat, cu decor personalizabil după dorința voastră.',
    features: ['Climatizare completă', 'Decor personalizabil'],
    images: [IMAGES.hallInterior, IMAGES.tentInterior, IMAGES.champagne]
  };
}
