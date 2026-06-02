import { Component } from '@angular/core';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { FloralCornerComponent } from '../../../shared/components/floral-corner.component';
import { IMAGES } from '../../../shared/data/images';

interface Post { img: string; url: string; network: 'instagram' | 'facebook'; }

@Component({
  selector: 'app-social-section',
  standalone: true,
  imports: [RevealDirective, FloralCornerComponent],
  template: `
    <section class="section relative overflow-hidden">
      <app-floral-corner corner="tl" variant="wildflower" [size]="180" />

      <div class="container-x relative">
        <div class="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left" appReveal="up">
          <div class="max-w-xl">
            <p class="eyebrow">Urmărește-ne</p>
            <h2 class="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">Momente de pe rețelele noastre</h2>
            <p class="mt-4 text-ink-600">Cele mai frumoase clipe, direct de pe Instagram și Facebook. Apasă pe o imagine pentru a vedea postarea.</p>
          </div>
          <div class="flex shrink-0 gap-3">
            <a [href]="instagram" target="_blank" rel="noopener" aria-label="Instagram"
               class="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-soft transition-transform hover:-translate-y-1">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a [href]="facebook" target="_blank" rel="noopener" aria-label="Facebook"
               class="grid h-12 w-12 place-items-center rounded-full bg-[#1877F2] text-white shadow-soft transition-transform hover:-translate-y-1">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M14 9h3l.5-3H14V4.5c0-.9.3-1.5 1.6-1.5H17V.3C16.7.2 15.8 0 14.7 0 12.3 0 11 1.4 11 4v2H8v3h3v9h3V9z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Posts grid -->
        <div class="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
             appReveal="up" [revealStagger]="70">
          @for (p of posts; track p.img) {
            <a [href]="p.url" target="_blank" rel="noopener"
               class="img-cine group relative aspect-square overflow-hidden rounded-2xl shadow-soft">
              <img [src]="p.img" alt="Postare Mirtanis Events" loading="lazy" class="h-full w-full object-cover" />
              <div class="absolute inset-0 flex items-center justify-center bg-ink-900/0 transition-colors duration-500 group-hover:bg-ink-900/45">
                <span class="mi scale-50 text-[30px] text-white opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                  {{ p.network === 'instagram' ? 'photo_camera' : 'thumb_up' }}
                </span>
              </div>
              <span class="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-cream-50/90 text-ink-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span class="mi text-[15px]">open_in_new</span>
              </span>
            </a>
          }
        </div>
      </div>
    </section>
  `
})
export class SocialSectionComponent {
  // TODO: replace with the real profile + post URLs
  readonly instagram = 'https://www.instagram.com/mirtanisevents/';
  readonly facebook = 'https://www.facebook.com/mirtanisevents/';

  readonly posts: Post[] = [
    { img: IMAGES.gallery[0], url: this.instagram, network: 'instagram' },
    { img: IMAGES.gallery[4], url: this.facebook, network: 'facebook' },
    { img: IMAGES.gallery[2], url: this.instagram, network: 'instagram' },
    { img: IMAGES.gallery[8], url: this.facebook, network: 'facebook' },
    { img: IMAGES.gallery[3], url: this.instagram, network: 'instagram' },
    { img: IMAGES.gallery[6], url: this.facebook, network: 'facebook' }
  ];
}
