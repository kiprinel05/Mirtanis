import { Component, HostListener, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      [class.scrolled]="scrolled()"
    >
      <!-- Always-on subtle scrim so the bar reads over any hero image -->
      <div class="nav-scrim"></div>

      <nav
        class="container-x relative flex items-center justify-between transition-all"
        [class.py-3]="scrolled()"
        [class.py-5]="!scrolled()"
      >
        <!-- Brand -->
        <a
          routerLink="/"
          class="group flex items-center tap-highlight-none"
          aria-label="Mirtanis Events — acasă"
        >
          <img
            src="/logo-mare.png"
            alt="Mirtanis Events"
            class="brand-logo w-auto transition-all duration-500 group-hover:scale-[1.03]"
            [class.h-11]="!scrolled()"
            [class.h-10]="scrolled()"
          />
        </a>

        <!-- Desktop links -->
        <div class="hidden items-center gap-8 lg:flex">
          @for (l of links; track l.path) {
            <a
              [routerLink]="l.path"
              routerLinkActive="text-gold-700"
              [routerLinkActiveOptions]="{ exact: l.path === '/' }"
              class="relative text-sm font-medium tracking-wide text-ink-800 transition-colors hover:text-gold-700
                      after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold-500
                      after:transition-all hover:after:w-full"
            >
              {{ l.label }}
            </a>
          }
          <a routerLink="/rezervari" class="btn btn-gold py-2.5 text-sm"
            >Verifică data</a
          >
        </div>

        <!-- Mobile toggle -->
        <button
          class="relative z-50 grid h-11 w-11 place-items-center rounded-full text-ink-900 lg:hidden tap-highlight-none"
          (click)="toggle()"
          [attr.aria-expanded]="open()"
          aria-label="Meniu"
        >
          <span class="mi text-[28px]">menu</span>
        </button>
      </nav>

      <!-- Scroll progress (sits at the very bottom edge of the header, on its own track) -->
      <div class="progress-track">
        <div class="progress-fill" [style.width.%]="progress()"></div>
      </div>
    </header>

    <!-- ===== Mobile menu: drops from the top, blurs the whole page ===== -->
    <div
      class="mobile-menu lg:hidden"
      [class.is-open]="open()"
      (click)="close()"
    >
      <div class="mobile-menu__panel" (click)="$event.stopPropagation()">
        <!-- Top row: logo (left) + close (right) -->
        <div class="flex items-center justify-between">
          <img src="/logo-mare.png" alt="Mirtanis Events" class="h-9 w-auto" />
          <button
            (click)="close()"
            aria-label="Închide meniul"
            class="grid h-11 w-11 place-items-center rounded-full text-ink-900 transition-colors hover:text-gold-600 tap-highlight-none"
          >
            <span class="mi text-[28px]">close</span>
          </button>
        </div>

        <!-- Links (centered) -->
        <nav class="mt-10 flex flex-col items-center">
          @for (l of links; track l.path; let i = $index) {
            <a
              [routerLink]="l.path"
              (click)="close()"
              routerLinkActive="text-gold-700"
              [routerLinkActiveOptions]="{ exact: l.path === '/' }"
              class="mm-link w-full border-b border-gray-300/90 py-5 text-center font-display text-3xl text-ink-900 transition-colors hover:text-gold-600"
              [style.transition-delay]="open() ? 120 + i * 55 + 'ms' : '0ms'"
            >
              {{ l.label }}
            </a>
          }
        </nav>

        <div
          class="mm-link mt-10 flex justify-center"
          [style.transition-delay]="
            open() ? 120 + links.length * 55 + 'ms' : '0ms'
          "
        >
          <a
            routerLink="/rezervari"
            (click)="close()"
            class="btn btn-gold px-10"
          >
            Verifică disponibilitatea
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Permanent, very soft top scrim — keeps the bar legible over bright hero
       imagery without looking like a solid bar at the top of the page. */
      .nav-scrim {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          rgba(255, 253, 250, 0.9) 0%,
          rgba(255, 253, 250, 0.5) 55%,
          rgba(255, 253, 250, 0) 100%
        );
        backdrop-filter: blur(3px);
        pointer-events: none;
        transition:
          opacity 0.5s ease,
          background 0.5s ease;
      }
      /* Once scrolled, become a refined frosted bar with a hairline gold edge */
      header.scrolled .nav-scrim {
        background: rgba(255, 253, 250, 0.9);
        backdrop-filter: blur(18px) saturate(150%);
        box-shadow: 0 14px 40px -26px rgba(94, 75, 35, 0.55);
      }
      header.scrolled .nav-scrim::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(205, 162, 75, 0.5) 50%,
          transparent
        );
      }

      /* Gold wordmark logo — soft shadow keeps it legible on light hero imagery */
      .brand-logo {
        filter: drop-shadow(0 1px 6px rgba(120, 90, 30, 0.35));
      }

      .progress-track {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        background: rgba(110, 81, 33, 0.08);
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      header.scrolled .progress-track {
        opacity: 1;
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #b68a36, #e4c071);
        transition: width 0.12s linear;
      }

      /* ===== Mobile menu ===== */
      .mobile-menu {
        position: fixed;
        inset: 0;
        z-index: 45;
        /* Light, low-opacity tint + page-wide blur; text stays readable on the panel */
        background: rgba(40, 30, 16, 0.18);
        backdrop-filter: blur(8px) saturate(50%);
        -webkit-backdrop-filter: blur(8px) saturate(50%);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.45s ease;
      }
      .mobile-menu.is-open {
        opacity: 1;
        pointer-events: auto;
      }

      /* Panel drops in from the top — translucent, with strong blur so the
       text stays crisp while the page shows through underneath. */
      .mobile-menu__panel {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        padding: 20px 28px 44px;
        background: rgba(255, 253, 250, 0.92);
        backdrop-filter: blur(22px) saturate(150%);
        -webkit-backdrop-filter: blur(22px) saturate(150%);
        border-radius: 0 0 28px 28px;
        box-shadow: 0 30px 70px -30px rgba(40, 30, 12, 0.55);
        transform: translateY(-104%);
        transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .mobile-menu.is-open .mobile-menu__panel {
        transform: translateY(0);
      }

      /* Links fade/slide in (staggered via inline transition-delay) */
      .mm-link {
        opacity: 0;
        transform: translateY(-10px);
        transition:
          opacity 0.45s ease,
          transform 0.45s ease,
          color 0.3s ease;
      }
      .mobile-menu.is-open .mm-link {
        opacity: 1;
        transform: translateY(0);
      }
    `,
  ],
})
export class NavbarComponent {
  readonly links = [
    { path: "/", label: "Acasă" },
    { path: "/locatii", label: "Locații" },
    { path: "/galerie", label: "Galerie" },
    { path: "/rezervari", label: "Rezervări" },
    { path: "/contact", label: "Contact" },
  ];

  readonly scrolled = signal(false);
  readonly open = signal(false);
  readonly progress = signal(0);

  @HostListener("window:scroll")
  onScroll(): void {
    const y = window.scrollY;
    this.scrolled.set(y > 24);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    this.progress.set(h > 0 ? Math.min(100, (y / h) * 100) : 0);
  }

  toggle(): void {
    this.open.update((v) => !v);
    document.body.style.overflow = this.open() ? "hidden" : "";
  }
  close(): void {
    this.open.set(false);
    document.body.style.overflow = "";
  }
}
