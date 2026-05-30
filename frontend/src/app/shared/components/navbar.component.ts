import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="fixed top-0 inset-x-0 z-50 transition-all duration-700"
            [ngClass]="scrolled() ? 'bg-ink-950/80 backdrop-blur-xl border-b border-white/5' : ''">
      <nav class="container-luxe flex items-center justify-between px-6 py-5">
        <a routerLink="/" class="flex items-center gap-3 group">
          <span class="font-display text-2xl md:text-3xl gold-text leading-none">Mirtanis</span>
          <span class="hidden md:inline-block eyebrow text-white/60 mt-1">Events</span>
        </a>

        <ul class="hidden lg:flex items-center gap-10">
          <li *ngFor="let item of links">
            <a [routerLink]="item.path" routerLinkActive="text-gold-200" [routerLinkActiveOptions]="{exact: item.path === '/'}"
               class="group relative text-sm tracking-widest uppercase text-white/80 hover:text-white transition-colors duration-300">
              {{ item.label }}
              <span class="absolute -bottom-1 left-0 right-0 h-px scale-x-0 origin-left bg-gold-400 transition-transform duration-500 group-hover:scale-x-100"></span>
            </a>
          </li>
        </ul>

        <div class="flex items-center gap-3">
          <a routerLink="/rezervari" class="btn btn-primary hidden md:inline-flex">Verifică data</a>
          <button class="lg:hidden text-white p-2" (click)="toggle()" aria-label="Meniu">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path *ngIf="!open()" d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path *ngIf="open()" d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      <!-- Mobile sheet -->
      <div *ngIf="open()" class="lg:hidden bg-ink-950/95 backdrop-blur-xl border-t border-white/5">
        <ul class="container-luxe px-6 py-8 space-y-5">
          <li *ngFor="let item of links">
            <a [routerLink]="item.path" (click)="close()" class="block font-display text-3xl text-white/90 hover:gold-text transition">{{ item.label }}</a>
          </li>
          <li>
            <a routerLink="/rezervari" (click)="close()" class="btn btn-primary mt-4">Verifică data</a>
          </li>
        </ul>
      </div>
    </header>
  `
})
export class NavbarComponent {
  readonly links = [
    { label: 'Acasă', path: '/' },
    { label: 'Locații', path: '/locatii' },
    { label: 'Galerie', path: '/galerie' },
    { label: 'Rezervări', path: '/rezervari' },
    { label: 'Contact', path: '/contact' }
  ];
  readonly scrolled = signal(false);
  readonly open = signal(false);

  @HostListener('window:scroll')
  onScroll(): void { this.scrolled.set(window.scrollY > 24); }

  toggle(): void { this.open.update((v) => !v); }
  close(): void { this.open.set(false); }
}
