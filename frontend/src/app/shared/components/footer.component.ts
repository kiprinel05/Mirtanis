import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="relative mt-24 border-t border-white/5 bg-ink-950">
      <div class="absolute inset-x-0 -top-px gold-line"></div>

      <div class="container-luxe px-6 py-20 grid gap-12 md:grid-cols-4">
        <div class="md:col-span-2">
          <h3 class="font-display text-3xl md:text-4xl gold-text">Mirtanis Events</h3>
          <p class="mt-4 max-w-md text-white/65 leading-relaxed">
            „Un loc de vis.” O locație de poveste pe lac, dedicată momentelor care merită
            să rămână cu tine pentru totdeauna.
          </p>
          <div class="mt-6 flex items-center gap-4 text-white/70">
            <span class="flex items-center gap-1.5 text-gold-300">
              <span *ngFor="let s of [1,2,3,4,5]" class="text-base">★</span>
            </span>
            <span class="text-sm">4.5 / 5 — Google Reviews</span>
          </div>
        </div>

        <div>
          <h4 class="eyebrow mb-4">Navigare</h4>
          <ul class="space-y-2 text-white/75 text-sm">
            <li><a routerLink="/" class="hover:text-gold-200 transition">Acasă</a></li>
            <li><a routerLink="/locatii" class="hover:text-gold-200 transition">Locații</a></li>
            <li><a routerLink="/galerie" class="hover:text-gold-200 transition">Galerie</a></li>
            <li><a routerLink="/rezervari" class="hover:text-gold-200 transition">Rezervări</a></li>
            <li><a routerLink="/contact" class="hover:text-gold-200 transition">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 class="eyebrow mb-4">Contact</h4>
          <ul class="space-y-2 text-white/75 text-sm">
            <li>Lacul Mirtanis, România</li>
            <li>+40 700 000 000</li>
            <li>contact&#64;mirtanis.ro</li>
            <li class="pt-3 flex gap-3">
              <a href="#" class="hover:text-gold-200 transition">Instagram</a>
              <span class="text-white/30">·</span>
              <a href="#" class="hover:text-gold-200 transition">Facebook</a>
              <span class="text-white/30">·</span>
              <a href="#" class="hover:text-gold-200 transition">TikTok</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/5">
        <div class="container-luxe px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/45">
          <span>© {{ year }} Mirtanis Events. Toate drepturile rezervate.</span>
          <span class="italic font-display text-sm text-white/55">„Cea mai frumoasă locație pentru evenimente.”</span>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
