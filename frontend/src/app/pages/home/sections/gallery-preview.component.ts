import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { IMAGES } from '../../../shared/data/images';

@Component({
  selector: 'app-gallery-preview',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  template: `
    <section class="section">
      <div class="container-x">
        <div class="flex flex-col items-end justify-between gap-6 sm:flex-row" appReveal="up">
          <div class="max-w-xl">
            <p class="eyebrow">Galerie</p>
            <h2 class="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">Momente surprinse pe lac</h2>
            <p class="mt-4 text-ink-600">O privire către evenimentele care au prins viață la Mirtanis.</p>
          </div>
          <a routerLink="/galerie" class="btn btn-outline shrink-0">Vezi toată galeria</a>
        </div>

        <!-- Editorial mosaic -->
        <div class="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] lg:grid-cols-4"
             appReveal="up" [revealStagger]="80">
          @for (g of tiles; track g.src; let i = $index) {
            <a routerLink="/galerie"
               class="img-cine group relative block overflow-hidden rounded-2xl shadow-soft"
               [class.col-span-2]="g.wide" [class.row-span-2]="g.tall">
              <img [src]="g.src" alt="Fotografie eveniment Mirtanis" loading="lazy" />
              <div class="absolute inset-0 bg-ink-900/0 transition-colors duration-500 group-hover:bg-ink-900/20"></div>
              <span class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span class="rounded-full bg-cream-50/90 px-4 py-2 text-xs uppercase tracking-widest2 text-ink-800">Vezi galeria</span>
              </span>
            </a>
          }
        </div>
      </div>
    </section>
  `
})
export class GalleryPreviewComponent {
  readonly tiles = [
    { src: IMAGES.gallery[4], wide: false, tall: true },
    { src: IMAGES.gallery[0], wide: false, tall: false },
    { src: IMAGES.gallery[2], wide: false, tall: false },
    { src: IMAGES.gallery[8], wide: false, tall: true },
    { src: IMAGES.gallery[3], wide: false, tall: false },
    { src: IMAGES.gallery[6], wide: false, tall: false }
  ];
}
