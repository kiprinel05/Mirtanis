import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      [class.scrolled]="scrolled()">
      <!-- Always-on subtle scrim so the bar reads over any hero image -->
      <div class="nav-scrim"></div>

      <nav class="container-x relative flex items-center justify-between transition-all"
           [class.py-3]="scrolled()" [class.py-5]="!scrolled()">
        <!-- Brand -->
        <a routerLink="/" class="group flex items-center tap-highlight-none" aria-label="Mirtanis Events — acasă">
          <img src="/logo-mare.png" alt="Mirtanis Events"
               class="brand-logo w-auto transition-all duration-500 group-hover:scale-[1.03]"
               [class.h-11]="!scrolled()" [class.h-10]="scrolled()" />
        </a>

        <!-- Desktop links -->
        <div class="hidden items-center gap-8 lg:flex">
          @for (l of links; track l.path) {
            <a [routerLink]="l.path" routerLinkActive="text-gold-700"
               [routerLinkActiveOptions]="{ exact: l.path === '/' }"
               class="relative text-sm font-medium tracking-wide text-ink-800 transition-colors hover:text-gold-700
                      after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold-500
                      after:transition-all hover:after:w-full">
              {{ l.label }}
            </a>
          }
          <a routerLink="/rezervari" class="btn btn-gold py-2.5 text-sm">Verifică data</a>
        </div>

        <!-- Mobile toggle -->
        <button class="relative z-50 grid h-11 w-11 place-items-center rounded-full lg:hidden tap-highlight-none"
                (click)="toggle()" [attr.aria-expanded]="open()" aria-label="Meniu">
          <span class="relative block h-4 w-6">
            <span class="absolute left-0 block h-0.5 w-6 bg-ink-900 transition-all duration-300"
                  [class.top-0]="!open()" [class.rotate-45]="open()" [class.top-1.5]="open()"></span>
            <span class="absolute left-0 top-1.5 block h-0.5 w-6 bg-ink-900 transition-all duration-300"
                  [class.opacity-0]="open()"></span>
            <span class="absolute left-0 block h-0.5 w-6 bg-ink-900 transition-all duration-300"
                  [class.bottom-0]="!open()" [class.-rotate-45]="open()" [class.bottom-1.5]="open()"></span>
          </span>
        </button>
      </nav>

      <!-- Scroll progress (sits at the very bottom edge of the header, on its own track) -->
      <div class="progress-track">
        <div class="progress-fill" [style.width.%]="progress()"></div>
      </div>
    </header>

    <!-- Mobile drawer -->
    <div class="fixed inset-0 z-40 lg:hidden transition-all duration-500"
         [class.pointer-events-none]="!open()" [class.opacity-0]="!open()" [class.opacity-100]="open()">
      <div class="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" (click)="close()"></div>
      <div class="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-cream-50 px-7 pb-10 pt-28 shadow-lift transition-transform duration-500"
           [class.translate-x-0]="open()" [class.translate-x-full]="!open()">
        <img src="/logo-mare.png" alt="Mirtanis Events" class="mx-auto mb-8 h-12 w-auto" />
        @for (l of links; track l.path) {
          <a [routerLink]="l.path" (click)="close()" routerLinkActive="text-gold-600"
             [routerLinkActiveOptions]="{ exact: l.path === '/' }"
             class="border-b border-cream-300 py-4 font-display text-2xl text-ink-800 transition-colors hover:text-gold-600">
            {{ l.label }}
          </a>
        }
        <a routerLink="/rezervari" (click)="close()" class="btn btn-gold mt-8 w-full">Verifică disponibilitatea</a>
        <div class="mt-auto pt-8 text-sm text-ink-500">
          <p>+40 7XX XXX XXX</p>
          <p>contact&#64;mirtanis.ro</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Permanent, very soft top scrim — keeps the bar legible over bright hero
       imagery without looking like a solid bar at the top of the page. */
    .nav-scrim {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(255,253,250,.9) 0%, rgba(255,253,250,.5) 55%, rgba(255,253,250,0) 100%);
      backdrop-filter: blur(3px);
      pointer-events: none;
      transition: opacity .5s ease, background .5s ease;
    }
    /* Once scrolled, become a refined frosted bar with a hairline gold edge */
    header.scrolled .nav-scrim {
      background: rgba(255,253,250,.9);
      backdrop-filter: blur(18px) saturate(150%);
      box-shadow: 0 14px 40px -26px rgba(94,75,35,.55);
    }
    header.scrolled .nav-scrim::after {
      content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(205,162,75,.5) 50%, transparent);
    }

    /* Gold wordmark logo — soft shadow keeps it legible on light hero imagery */
    .brand-logo {
      filter: drop-shadow(0 1px 6px rgba(120, 90, 30, 0.35));
    }

    .progress-track {
      position: absolute; left: 0; right: 0; bottom: 0; height: 2px;
      background: rgba(110,81,33,.08);
      opacity: 0; transition: opacity .4s ease;
    }
    header.scrolled .progress-track { opacity: 1; }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #b68a36, #e4c071);
      transition: width .12s linear;
    }
  `]
})
export class NavbarComponent {
  readonly links = [
    { path: '/', label: 'Acasă' },
    { path: '/locatii', label: 'Locații' },
    { path: '/galerie', label: 'Galerie' },
    { path: '/rezervari', label: 'Rezervări' },
    { path: '/contact', label: 'Contact' }
  ];

  readonly scrolled = signal(false);
  readonly open = signal(false);
  readonly progress = signal(0);

  @HostListener('window:scroll')
  onScroll(): void {
    const y = window.scrollY;
    this.scrolled.set(y > 24);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    this.progress.set(h > 0 ? Math.min(100, (y / h) * 100) : 0);
  }

  toggle(): void {
    this.open.update((v) => !v);
    document.body.style.overflow = this.open() ? 'hidden' : '';
  }
  close(): void {
    this.open.set(false);
    document.body.style.overflow = '';
  }
}
