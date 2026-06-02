import { Component, HostListener, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <!-- Backdrop blur for the rest of the page while the mobile menu is open -->
    <div
      class="fixed inset-0 z-40 lg:hidden"
      [class.menu-backdrop--show]="open()"
      [class.menu-backdrop--hide]="!open()"
      (click)="close()"
    ></div>

    <header
      class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      [class.scrolled]="scrolled()"
      [class.is-open]="open()"
    >
      <!-- Solid/scrim surface that also forms the expanding panel background -->
      <div class="nav-surface"></div>

      <nav
        class="container-x relative flex items-center justify-between py-3 transition-all duration-300"
        [class.sm:py-3]="scrolled()"
        [class.sm:py-5]="!scrolled()"
      >
        <!-- Brand: fixed size on mobile, shrinks only on desktop (sm+) when scrolled -->
        <a
          routerLink="/"
          class="group flex items-center tap-highlight-none"
          aria-label="Mirtanis Events — acasă"
          (click)="close()"
        >
          <img
            src="/logo-mare-black.png"
            alt="Mirtanis Events"
            class="brand-logo h-11 w-auto transition-all duration-300 group-hover:scale-[1.03]"
            [class.sm:h-10]="scrolled()"
            [class.sm:h-14]="!scrolled()"
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

        <!-- Mobile toggle: animated hamburger ↔ X -->
        <button
          class="burger relative grid h-9 w-9 place-items-center rounded-full lg:hidden tap-highlight-none"
          [class.is-open]="open()"
          (click)="toggle()"
          [attr.aria-expanded]="open()"
          aria-label="Meniu"
        >
          <span class="burger__box">
            <span class="burger__line"></span>
            <span class="burger__line"></span>
            <span class="burger__line"></span>
          </span>
        </button>
      </nav>

      <!-- Expanding mobile panel (part of the header itself) -->
      <div class="nav-collapse lg:hidden" [class.is-open]="open()">
        <nav class="container-x flex flex-col pb-8 pt-2">
          @for (l of links; track l.path; let i = $index) {
            <a
              [routerLink]="l.path"
              (click)="close()"
              routerLinkActive="text-gold-700"
              [routerLinkActiveOptions]="{ exact: l.path === '/' }"
              class="mm-link border-b border-cream-300/70 py-4 text-center font-display text-2xl text-ink-900 transition-colors hover:text-gold-600"
              [style.transition-delay]="open() ? 80 + i * 50 + 'ms' : '0ms'"
            >
              {{ l.label }}
            </a>
          }
          <div
            class="mm-link mt-6 flex justify-center"
            [style.transition-delay]="
              open() ? 80 + links.length * 50 + 'ms' : '0ms'
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
        </nav>
      </div>

      <!-- Scroll progress -->
      <div class="progress-track">
        <div class="progress-fill" [style.width.%]="progress()"></div>
      </div>
    </header>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      /* ===== Surface: scrim normally, solid when scrolled/open ===== */
      .nav-surface {
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
          background 0.5s ease,
          box-shadow 0.5s ease,
          backdrop-filter 0.5s ease;
      }
      header.scrolled .nav-surface {
        background: rgba(255, 253, 250, 0.95);
        backdrop-filter: blur(18px) saturate(150%);
        box-shadow: 0 18px 50px -28px rgba(94, 75, 35, 0.55);
      }
      /* When open, the bar merges seamlessly into the panel below it —
         same solid fill, no bottom radius, no shadow/hairline between them. */
      header.is-open .nav-surface {
        background: rgba(255, 253, 250, 0.97);
        backdrop-filter: blur(18px) saturate(150%);
        box-shadow: none;
        border-radius: 0;
      }
      header.scrolled:not(.is-open) .nav-surface::after {
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
      header.is-open .nav-surface::after {
        opacity: 0;
      }

      .brand-logo {
        filter: drop-shadow(0 1px 6px rgba(120, 90, 30, 0.35));
      }

      /* ===== Animated hamburger ===== */
      .burger__box {
        position: relative;
        display: block;
        width: 24px;
        height: 16px;
      }
      .burger__line {
        position: absolute;
        left: 0;
        height: 2px;
        width: 100%;
        background: #241f19;
        border-radius: 2px;
        transition:
          transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
          opacity 0.3s ease;
      }
      .burger__line:nth-child(1) {
        top: 0;
      }
      .burger__line:nth-child(2) {
        top: 7px;
      }
      .burger__line:nth-child(3) {
        top: 14px;
      }
      .burger.is-open .burger__line:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }
      .burger.is-open .burger__line:nth-child(2) {
        opacity: 0;
        transform: translateX(-8px);
      }
      .burger.is-open .burger__line:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }

      /* ===== Expanding collapse panel =====
         Absolutely positioned so it never adds height to the bar itself. */
      .nav-collapse {
        position: absolute;
        left: 0;
        right: 0;
        top: 100%;
        display: grid;
        grid-template-rows: 0fr;
        opacity: 0;
        background: rgba(255, 253, 250, 0.97);
        backdrop-filter: blur(18px) saturate(150%);
        -webkit-backdrop-filter: blur(18px) saturate(150%);
        border-radius: 0 0 26px 26px;
        box-shadow: 0 30px 60px -34px rgba(40, 30, 12, 0.5);
        pointer-events: none;
        transition:
          grid-template-rows 0.5s cubic-bezier(0.22, 1, 0.36, 1),
          opacity 0.4s ease;
      }
      /* lift the panel up 1px so it overlaps the bar — no seam line */
      .nav-collapse {
        margin-top: -1px;
      }
      .nav-collapse > nav {
        overflow: hidden;
        min-height: 0;
      }
      .nav-collapse.is-open {
        grid-template-rows: 1fr;
        opacity: 1;
        pointer-events: auto;
      }

      .mm-link {
        opacity: 0;
        transform: translateY(-8px);
        transition:
          opacity 0.45s ease,
          transform 0.45s ease,
          color 0.3s ease;
      }
      .nav-collapse.is-open .mm-link {
        opacity: 1;
        transform: translateY(0);
      }

      /* ===== Page backdrop ===== */
      .menu-backdrop--hide {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.45s ease;
      }
      .menu-backdrop--show {
        opacity: 1;
        pointer-events: auto;
        background: rgba(40, 30, 16, 0.28);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        transition: opacity 0.45s ease;
      }

      /* ===== Progress bar ===== */
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
      header.is-open .progress-track {
        opacity: 0;
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #b68a36, #e4c071);
        transition: width 0.12s linear;
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
