import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { ParallaxDirective } from '../../../shared/directives/parallax.directive';
import { TiltDirective } from '../../../shared/directives/tilt.directive';
import { FloralCornerComponent } from '../../../shared/components/floral-corner.component';
import { IMAGES } from '../../../shared/data/images';

@Component({
  selector: 'app-story-section',
  standalone: true,
  imports: [RouterLink, RevealDirective, ParallaxDirective, TiltDirective, FloralCornerComponent],
  template: `
    <section class="section relative overflow-hidden">
      <app-floral-corner corner="tl" variant="eucalyptus" [size]="200" />
      <app-floral-corner corner="br" variant="rose" [size]="190" />
      <div class="container-x relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <!-- Images -->
        <div class="relative" appReveal="left">
          <div appTilt class="img-cine gold-frame aspect-[4/5] overflow-hidden rounded-3xl shadow-card">
            <div appParallax [parallaxFactor]="0.1" class="absolute inset-x-0 -top-[10%] h-[120%]">
              <img [src]="main" alt="Decor elegant la Mirtanis Events" class="h-full w-full object-cover" loading="lazy" />
            </div>
          </div>
          <div class="img-cine anim-float absolute -bottom-10 -right-4 z-20 hidden aspect-square w-44 rounded-2xl border-4 border-cream-50 shadow-lift sm:block lg:w-56">
            <img [src]="detail" alt="Cuplu la Mirtanis Events" loading="lazy" />
          </div>
        </div>

        <!-- Text -->
        <div appReveal="right">
          <p class="eyebrow">Povestea noastră</p>
          <h2 class="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">
            Nuntă pe lac — <span class="gold-text">emoție și natură</span>
          </h2>
          <p class="mt-6 text-lg leading-relaxed text-ink-600">
            La Mirtanis Events totul se bazează pe poveste, nu pe opulență. Lacul, lumina
            caldă a apusului și natura din jur creează un ambient firesc, în care emoția
            curge de la sine, iar invitații se simt acasă.
          </p>
          <ul class="mt-8 space-y-4" appReveal="up" [revealStagger]="90" [revealDelay]="150">
            @for (f of features; track f) {
              <li class="flex items-start gap-3">
                <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-600"><span class="mi text-[15px]">check</span></span>
                <span class="text-ink-700">{{ f }}</span>
              </li>
            }
          </ul>
          <a routerLink="/locatii" class="btn btn-outline mt-10">Vezi locațiile</a>
        </div>
      </div>
    </section>
  `
})
export class StorySectionComponent {
  readonly main = IMAGES.storyTable;
  readonly detail = IMAGES.storyDetails;
  readonly features = [
    'Priveliște deschisă către lac, perfectă pentru ceremonii în aer liber',
    'Cort premium și sală interioară, pentru orice anotimp',
    'Echipă dedicată care coordonează fiecare detaliu',
    'Spațiu generos de parcare și acces facil pentru invitați'
  ];
}
