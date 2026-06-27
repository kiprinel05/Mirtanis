import { AfterViewInit, Component, NgZone, OnDestroy, inject, signal } from "@angular/core";
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

        <!-- Desktop links + contact -->
        <div class="hidden items-center gap-6 lg:flex">
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

          <span class="h-5 w-px bg-cream-300"></span>

          <!-- Phone: plain text, no icon -->
          <a
            href="tel:+40767690552"
            class="text-sm font-semibold tracking-wide text-ink-900 transition-colors hover:text-gold-700 tap-highlight-none"
            >+40 767 690 552</a
          >

          <!-- WhatsApp: round brand button -->
          <a
            href="https://wa.me/40767690552"
            target="_blank"
            rel="noopener"
            aria-label="Scrie-ne pe WhatsApp"
            class="grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white shadow-sm transition hover:bg-[#1eb858] hover:shadow-md"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </a>

          <a routerLink="/contact" class="btn btn-gold py-2.5 text-sm"
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
          <!-- Quick contact: phone + WhatsApp, matched buttons -->
          <div
            class="mm-link mt-6 flex flex-col items-center gap-3"
            [style.transition-delay]="
              open() ? 80 + links.length * 50 + 'ms' : '0ms'
            "
          >
            <a
              href="tel:+40767690552"
              (click)="close()"
              class="btn btn-gold w-64 max-w-[80vw]"
            >
              <span class="mi text-[18px]">call</span>
              +40 767 690 552
            </a>
            <a
              href="https://wa.me/40767690552"
              target="_blank"
              rel="noopener"
              (click)="close()"
              class="btn w-64 max-w-[80vw] bg-[#25D366] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#1eb858]"
            >
              <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Scrie-ne pe WhatsApp
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
export class NavbarComponent implements AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);

  readonly links = [
    { path: "/", label: "Acasă" },
    { path: "/locatii", label: "Locații" },
    { path: "/galerie", label: "Galerie" },
    { path: "/contact", label: "Contact" },
  ];

  readonly scrolled = signal(false);
  readonly open = signal(false);
  readonly progress = signal(0);

  private ticking = false;
  private wasScrolled = false;
  private lastProgress = 0;

  private readonly onScroll = () => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const isScrolled = y > 24;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const prog = h > 0 ? Math.min(100, Math.round((y / h) * 100)) : 0;
      // Only re-enter Angular (trigger CD) when a value actually changed.
      if (isScrolled !== this.wasScrolled || prog !== this.lastProgress) {
        this.wasScrolled = isScrolled;
        this.lastProgress = prog;
        this.zone.run(() => {
          this.scrolled.set(isScrolled);
          this.progress.set(prog);
        });
      }
      this.ticking = false;
    });
  };

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener("scroll", this.onScroll, { passive: true });
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener("scroll", this.onScroll);
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
