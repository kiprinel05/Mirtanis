import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { IMAGES } from '../../../shared/data/images';

@Component({
  selector: 'app-story-section',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  template: `
    <section class="section bg-cream-fade">
      <div class="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <!-- Images -->
        <div class="relative" appReveal="left">
          <div class="img-cine gold-frame hover-lift aspect-[4/5] rounded-3xl shadow-card">
            <img [src]="main" alt="Decor elegant la Mirtanis Events" loading="lazy" />
          </div>
          <div class="img-cine anim-float absolute -bottom-10 -right-4 hidden aspect-square w-44 rounded-2xl border-4 border-cream-50 shadow-lift sm:block lg:w-56">
            <img [src]="detail" alt="Buchet de mireasă" loading="lazy" />
          </div>
        </div>

        <!-- Text -->
        <div appReveal="right">
          <p class="eyebrow">Povestea noastră</p>
          <h2 class="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">
            Un loc gândit pentru <span class="gold-text">momentele care contează</span>
          </h2>
          <p class="mt-6 text-lg leading-relaxed text-ink-600">
            La Mirtanis Events, fiecare detaliu este atins de lumina caldă a apusului peste lac.
            De la cortul premium cu vedere panoramică până la sala interioară elegantă,
            am creat un cadru în care emoția curge firesc, iar invitații se simt acasă.
          </p>
          <ul class="mt-8 space-y-4" appReveal="up" [revealStagger]="90" [revealDelay]="150">
            @for (f of features; track f) {
              <li class="flex items-start gap-3">
                <span class="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-600">✦</span>
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
