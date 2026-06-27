import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  Inject,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ScrollService } from "../../core/services/scroll.service";
import { MagneticDirective } from "../../core/directives/magnetic.directive";

interface NavItem {
  label: string;
  href: string;
}

@Component({
  selector: "fb-navbar",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive, MagneticDirective],
  template: `
    <header
      class="fixed top-0 left-0 right-0 z-[9000] transition-all duration-500"
      [class.bg-primary]="scrolled() || menuOpen()"
      [class.bg-opacity-70]="scrolled() && !menuOpen()"
      [class.backdrop-blur-xl]="scrolled() && !menuOpen()"
      [class.border-b]="scrolled() && !menuOpen()"
      [class.border-white]="scrolled() && !menuOpen()"
      [class.border-opacity-5]="scrolled() && !menuOpen()"
    >
      <nav
        class="container-elegant flex items-center justify-between px-6 lg:px-10 py-5 lg:py-6"
        aria-label="Main navigation"
      >
        <!-- Logo (mare) -->
        <a
          routerLink="/"
          (click)="scrollToTop($event)"
          class="group flex items-center z-10 transition-transform duration-500 hover:scale-105"
          aria-label="Pagina principală Foto Bugeac"
        >
          <img
            src="assets/logo/logo-mare.png"
            alt="Foto Bugeac — Studio Cinematografic"
            class="h-10 md:h-14 w-auto"
          />
        </a>

        <!-- Desktop Menu -->
        <ul
          class="hidden lg:flex items-center gap-9 text-sm font-body"
          role="menubar"
        >
          @for (item of navItems; track item.href) {
            <li role="none">
              <a
                [href]="item.href"
                (click)="onNavClick($event, item.href)"
                class="hover-underline text-offwhite/80 hover:text-offwhite transition-colors duration-300 tracking-wide"
                role="menuitem"
                >{{ item.label }}</a
              >
            </li>
          }
        </ul>

        <!-- Right cluster -->
        <div class="hidden lg:flex items-center gap-5">
          <!-- CTA -->
          <a
            href="#contact"
            (click)="onNavClick($event, '#contact')"
            class="btn-primary text-xs"
            >Rezervă o Ședință</a
          >
        </div>

        <!-- Mobile burger -->
        <button
          (click)="toggleMenu()"
          class="lg:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-1.5 z-10"
          [attr.aria-expanded]="menuOpen()"
          aria-label="Comută meniul"
        >
          <span
            class="block h-[1px] w-7 bg-offwhite transition-all duration-500"
            [class.rotate-45]="menuOpen()"
            [class.translate-y-2]="menuOpen()"
          ></span>
          <span
            class="block h-[1px] w-7 bg-offwhite transition-all duration-300"
            [class.opacity-0]="menuOpen()"
          ></span>
          <span
            class="block h-[1px] w-7 bg-offwhite transition-all duration-500"
            [class.-rotate-45]="menuOpen()"
            [class.-translate-y-2]="menuOpen()"
          ></span>
        </button>
      </nav>
    </header>

    <!-- Mobile Menu Drawer (SIBLING of header, not child, so the header's
         backdrop-filter doesn't create a containing block that traps it) -->
    <div
      class="mobile-drawer lg:hidden"
      [class.is-open]="menuOpen()"
      role="dialog"
      aria-modal="true"
      aria-label="Meniu principal"
    >
      <!-- Backdrop (solid + blur layered so it never leaks the page) -->
      <button
        class="mobile-drawer__backdrop"
        (click)="toggleMenu()"
        aria-label="Închide meniul"
      ></button>

      <!-- Drawer panel -->
      <div class="mobile-drawer__panel">
        <!-- Ambient glow accents -->
        <div
          class="glow-orb glow-orb--gold absolute w-[420px] h-[420px] -top-48 -right-32 opacity-25 pointer-events-none"
        ></div>
        <div
          class="glow-orb glow-orb--purple absolute w-[360px] h-[360px] -bottom-32 -left-32 opacity-20 pointer-events-none"
        ></div>

        <!-- Header strip inside drawer (logo + close) -->
        <div class="mobile-drawer__head">
          <a
            routerLink="/"
            (click)="toggleMenu()"
            class="flex items-center gap-3"
          >
            <img
              src="assets/logo/log-mic.png"
              alt="Foto Bugeac"
              class="h-10 w-auto"
            />
            <div class="leading-tight">
              <div class="font-display text-lg text-offwhite">Foto Bugeac</div>
              <div
                class="text-[9px] tracking-[0.35em] uppercase text-gold/70 mt-0.5"
              >
                Studio Cinematografic
              </div>
            </div>
          </a>
          <button
            (click)="toggleMenu()"
            class="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-offwhite hover:border-gold hover:text-gold transition-colors"
            aria-label="Închide meniul"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class="w-4 h-4"
            >
              <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="divider-gold mt-2 opacity-40"></div>

        <!-- Nav items, centered -->
        <ul class="mobile-drawer__list">
          @for (item of navItems; track item.href; let i = $index) {
            <li
              class="mobile-drawer__item"
              [style.transition-delay]="
                menuOpen() ? i * 45 + 120 + 'ms' : '0ms'
              "
            >
              <a
                [href]="item.href"
                (click)="onNavClick($event, item.href)"
                class="mobile-drawer__link"
              >
                <span class="mobile-drawer__index">0{{ i + 1 }}</span>
                <span class="mobile-drawer__label">{{ item.label }}</span>
              </a>
            </li>
          }
        </ul>

        <!-- Footer: CTA -->
        <div class="mobile-drawer__foot">
          <a
            href="#contact"
            (click)="onNavClick($event, '#contact')"
            class="btn-primary w-full justify-center text-xs"
            >Rezervă o Ședință</a
          >
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* =============================================================
       Mobile menu drawer — bulletproof full-screen overlay
    ============================================================= */
      .mobile-drawer {
        position: fixed;
        inset: 0;
        z-index: 9500;
        pointer-events: none;
        visibility: hidden;
        transition: visibility 0.5s;
      }
      .mobile-drawer.is-open {
        visibility: visible;
        pointer-events: auto;
      }

      /* Solid dark backdrop with strong blur — fully covers the page */
      .mobile-drawer__backdrop {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
        cursor: pointer;
        background:
          radial-gradient(
            ellipse at top right,
            rgba(40, 20, 60, 0.85) 0%,
            rgba(11, 11, 15, 0.96) 60%
          ),
          rgba(11, 11, 15, 0.97);
        -webkit-backdrop-filter: blur(28px) saturate(140%);
        backdrop-filter: blur(28px) saturate(140%);
        opacity: 0;
        transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .mobile-drawer.is-open .mobile-drawer__backdrop {
        opacity: 1;
      }

      /* Drawer panel sits on top of backdrop */
      .mobile-drawer__panel {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        padding: 1rem 1.25rem 1.75rem;
        padding-top: max(1rem, env(safe-area-inset-top, 0px));
        padding-bottom: max(1.75rem, env(safe-area-inset-bottom, 0px));
        overflow: hidden;
        transform: translateY(-12px);
        opacity: 0;
        transition:
          transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
          opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .mobile-drawer.is-open .mobile-drawer__panel {
        transform: translateY(0);
        opacity: 1;
      }

      .mobile-drawer__head {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .mobile-drawer__list {
        position: relative;
        z-index: 1;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.25rem;
        padding: 1.5rem 0;
        list-style: none;
        margin: 0;
      }

      .mobile-drawer__item {
        width: 100%;
        max-width: 320px;
        opacity: 0;
        transform: translateX(-16px);
        transition:
          opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .mobile-drawer.is-open .mobile-drawer__item {
        opacity: 1;
        transform: translateX(0);
      }

      .mobile-drawer__link {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 0.8rem;
        width: 100%;
        padding: 0.6rem 0.5rem;
        font-family: "Cormorant Garamond", serif;
        font-size: 1.875rem;
        letter-spacing: -0.01em;
        color: #f8f8f8;
        text-align: center;
        transition:
          color 0.35s,
          transform 0.35s;
      }
      .mobile-drawer__link:hover,
      .mobile-drawer__link:focus-visible {
        color: #d4af37;
        transform: translateX(2px);
      }
      .mobile-drawer__index {
        font-family: "Inter", sans-serif;
        font-size: 0.625rem;
        letter-spacing: 0.3em;
        color: rgba(212, 175, 55, 0.55);
        font-weight: 500;
      }

      .mobile-drawer__foot {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }
    `,
  ],
})
export class NavbarComponent {
  private readonly scrollSvc = inject(ScrollService);

  protected readonly menuOpen = signal(false);
  protected readonly scrolled = computed(() => this.scrollSvc.scrollY() > 30);

  protected readonly navItems: NavItem[] = [
    { label: "Acasă", href: "#hero" },
    { label: "Servicii", href: "#services" },
    { label: "Portofoliu", href: "#portfolio" },
    { label: "Studio", href: "#why" },
    { label: "Testimoniale", href: "#testimonials" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    if (isPlatformBrowser(this.platformId)) {
      if (this.menuOpen()) this.scrollSvc.stop();
      else this.scrollSvc.start();
    }
  }

  protected onNavClick(e: Event, href: string): void {
    if (href.startsWith("#")) {
      e.preventDefault();
      this.menuOpen.set(false);
      if (isPlatformBrowser(this.platformId)) {
        this.scrollSvc.start();
      }
      this.scrollSvc.scrollTo(href, -80);
    }
  }

  protected scrollToTop(e: Event): void {
    e.preventDefault();
    this.scrollSvc.scrollTo(0);
  }

  @HostListener("window:keydown.escape")
  onEscape(): void {
    if (this.menuOpen()) this.toggleMenu();
  }
}
