import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  Inject,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import { RevealOnScrollDirective } from '../../core/directives/reveal-on-scroll.directive';
import { CounterDirective } from '../../core/directives/counter.directive';
import { ParallaxDirective } from '../../core/directives/parallax.directive';
import { MagneticDirective } from '../../core/directives/magnetic.directive';
import { ScrollService } from '../../core/services/scroll.service';

interface Category {
  id: string;
  label: string;
  count: number;
}

interface PortfolioItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  location?: string;
  year?: number;
  /** Aspect-ratio hint for masonry. */
  ratio: 'square' | 'portrait' | 'landscape' | 'tall' | 'wide';
  featured?: boolean;
}

interface FeaturedStory {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  cover: string;
  description: string;
  count: number;
  category: string;
}

type SortKey = 'recent' | 'featured' | 'name';

@Component({
  selector: 'fb-portfolio-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    RevealOnScrollDirective,
    CounterDirective,
    ParallaxDirective,
    MagneticDirective,
  ],
  template: `
    <!-- =====================================================
         HERO HEADER
    ===================================================== -->
    <section
      class="relative h-[78vh] min-h-[560px] w-full overflow-hidden flex items-center justify-center text-center"
      aria-label="Portofoliu — Foto Bugeac"
    >
      <!-- Layered backdrop collage -->
      <div class="absolute inset-0 z-0 grid grid-cols-4 grid-rows-2 gap-1 opacity-60">
        @for (img of heroCollage; track img) {
          <div class="relative overflow-hidden">
            <img
              [src]="img"
              alt=""
              aria-hidden="true"
              loading="eager"
              class="w-full h-full object-cover scale-110"
            />
          </div>
        }
      </div>

      <!-- Cinematic overlay -->
      <div
        class="absolute inset-0 z-[1] bg-gradient-to-b from-primary/85 via-primary/70 to-primary"
        aria-hidden="true"
      ></div>
      <div
        class="absolute inset-0 z-[1] bg-radial-glow opacity-70"
        aria-hidden="true"
      ></div>

      <!-- Floating orbs -->
      <div class="glow-orb glow-orb--gold w-[600px] h-[600px] -top-32 -left-32 z-[1] animate-float-slow"></div>
      <div class="glow-orb glow-orb--purple w-[500px] h-[500px] -bottom-32 -right-32 z-[1] animate-float"></div>

      <!-- Frame border -->
      <div
        class="hidden md:block absolute top-24 left-8 right-8 bottom-24 z-[3] border border-gold/10 pointer-events-none"
        aria-hidden="true"
      ></div>

      <!-- Hero content -->
      <div class="relative z-[4] max-w-4xl mx-auto px-6 lg:px-10 flex flex-col items-center gap-7">
        <div
          class="hero-tag inline-flex items-center gap-3 px-4 py-2 rounded-full glass-gold"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
          <span class="text-[11px] tracking-[0.4em] uppercase text-gold font-body">
            Galeria atelierului
          </span>
        </div>

        <h1
          class="text-display text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] text-offwhite leading-[0.95] text-balance"
        >
          <span class="block">Portofoliu</span>
          <span class="block">
            de <em class="text-gold-gradient not-italic">amintiri</em> eterne.
          </span>
        </h1>

        <p class="max-w-2xl text-base md:text-lg text-offwhite/70 leading-relaxed">
          O selecție din peste {{ stats.totalShots }} de cadre create pentru
          peste {{ stats.totalEvents }} de evenimente — fiecare cu propria
          lumină, propria emoție, propria poveste.
        </p>

        <button
          (click)="scrollToGallery()"
          fbMagnetic
          class="btn-primary mt-2"
        >
          Explorează galeria
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4 ml-1">
            <path d="M12 5v14M6 13l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] flex flex-col items-center gap-2 text-offwhite/40">
        <span class="text-[10px] tracking-[0.4em] uppercase">Derulează</span>
        <div class="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent"></div>
      </div>
    </section>

    <!-- =====================================================
         STATS STRIP
    ===================================================== -->
    <section class="relative py-16 px-6 bg-secondary overflow-hidden">
      <div class="glow-orb glow-orb--gold w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"></div>

      <div
        class="container-elegant relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4"
        fbReveal="stagger"
      >
        @for (stat of statCards; track stat.label) {
          <div class="text-center">
            <div
              class="font-display text-4xl md:text-5xl text-gold-gradient mb-2"
              [fbCounter]="stat.value"
              [suffix]="stat.suffix || ''"
            >
              0
            </div>
            <div class="text-[10px] tracking-[0.3em] uppercase text-offwhite/50">
              {{ stat.label }}
            </div>
          </div>
        }
      </div>
    </section>

    <!-- =====================================================
         FEATURED STORIES
    ===================================================== -->
    <section class="relative section-padding bg-primary overflow-hidden">
      <div class="glow-orb glow-orb--warm w-[500px] h-[500px] top-1/4 -right-32 opacity-20"></div>

      <div class="container-elegant relative">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12" fbReveal="fade">
          <div>
            <div class="inline-flex items-center gap-3 mb-4 text-[11px] tracking-[0.4em] uppercase text-gold/80">
              <span class="h-[1px] w-10 bg-gold/40"></span>
              <span>Povești recente</span>
            </div>
            <h2 class="text-display text-4xl md:text-5xl text-offwhite leading-[1.05]">
              Comenzi <em class="text-gold-gradient not-italic">selecte</em>.
            </h2>
          </div>
          <p class="text-offwhite/60 max-w-md">
            Câteva dintre comenzile preferate ale studioului din ultimele
            sezoane — fiecare un univers vizual de sine stătător.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6" fbReveal="stagger">
          @for (story of featuredStories; track story.id) {
            <article
              (click)="openStory(story)"
              class="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
              tabindex="0"
            >
              <img
                [src]="story.cover"
                [alt]="story.title"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] ease-cinematic group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent"></div>
              <div class="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <span class="absolute top-5 left-5 px-3 py-1 text-[10px] tracking-[0.3em] uppercase rounded-full glass-gold text-gold">
                {{ story.category }}
              </span>

              <div class="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-2">
                <div class="text-[10px] tracking-[0.3em] uppercase text-offwhite/50">
                  {{ story.date }} · {{ story.count }} cadre
                </div>
                <h3 class="font-display text-2xl text-offwhite group-hover:text-gold transition-colors duration-500">
                  {{ story.title }}
                </h3>
                <p class="text-xs text-offwhite/60 leading-relaxed">
                  {{ story.subtitle }}
                </p>
                <div class="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 mt-2">
                  Vezi povestea
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-3.5 h-3.5">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- =====================================================
         GALLERY: filter bar + masonry
    ===================================================== -->
    <section
      id="gallery"
      class="relative section-padding bg-secondary overflow-hidden"
    >
      <div class="glow-orb glow-orb--gold w-[500px] h-[500px] -bottom-32 -left-32 opacity-20"></div>

      <div class="container-elegant relative">
        <div
          class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
          fbReveal="fade"
        >
          <div>
            <div class="inline-flex items-center gap-3 mb-4 text-[11px] tracking-[0.4em] uppercase text-gold/80">
              <span class="h-[1px] w-10 bg-gold/40"></span>
              <span>Întreaga galerie</span>
            </div>
            <h2 class="text-display text-4xl md:text-5xl text-offwhite leading-[1.05]">
              Răsfoiește
              <em class="text-gold-gradient not-italic">arhiva</em>.
            </h2>
          </div>
          <p class="text-sm text-offwhite/60">
            <strong class="text-offwhite">{{ filteredItems().length }}</strong>
            cadre afișate
            @if (activeCategory() !== 'Toate') {
              · categoria <span class="text-gold">{{ activeCategory() }}</span>
            }
          </p>
        </div>

        <!-- Sticky filter bar -->
        <div
          class="sticky top-24 z-30 -mx-2 px-2 py-3 mb-8 glass-strong rounded-2xl"
          fbReveal="fade"
        >
          <div class="flex flex-wrap items-center gap-2">
            @for (cat of categories(); track cat.id) {
              <button
                (click)="setCategory(cat.label)"
                [attr.aria-pressed]="activeCategory() === cat.label"
                class="group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-[0.2em] uppercase font-medium transition-all duration-500"
                [class]="
                  activeCategory() === cat.label
                    ? 'bg-gold text-primary shadow-glow'
                    : 'border border-white/10 text-offwhite/70 hover:border-gold/60 hover:text-gold'
                "
              >
                <span>{{ cat.label }}</span>
                <span
                  class="text-[9px] px-1.5 py-0.5 rounded-full"
                  [class]="
                    activeCategory() === cat.label
                      ? 'bg-primary/20 text-primary/90'
                      : 'bg-white/5 text-offwhite/50'
                  "
                >{{ cat.count }}</span>
              </button>
            }

            <div class="ml-auto flex items-center gap-1.5">
              <button
                (click)="setSort('recent')"
                class="px-3 py-2 rounded-full text-[10px] tracking-[0.25em] uppercase transition-all"
                [class]="
                  sort() === 'recent'
                    ? 'text-gold'
                    : 'text-offwhite/40 hover:text-offwhite'
                "
              >Recente</button>
              <button
                (click)="setSort('featured')"
                class="px-3 py-2 rounded-full text-[10px] tracking-[0.25em] uppercase transition-all"
                [class]="
                  sort() === 'featured'
                    ? 'text-gold'
                    : 'text-offwhite/40 hover:text-offwhite'
                "
              >Recomandate</button>
              <button
                (click)="setSort('name')"
                class="px-3 py-2 rounded-full text-[10px] tracking-[0.25em] uppercase transition-all"
                [class]="
                  sort() === 'name'
                    ? 'text-gold'
                    : 'text-offwhite/40 hover:text-offwhite'
                "
              >A–Z</button>
            </div>
          </div>
        </div>

        <!-- Masonry -->
        <div class="portfolio-masonry">
          @for (item of filteredItems(); track item.id; let i = $index) {
            <button
              (click)="openLightbox(i)"
              class="portfolio-tile group relative overflow-hidden rounded-xl img-cinematic focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              [class.tile--square]="item.ratio === 'square'"
              [class.tile--portrait]="item.ratio === 'portrait'"
              [class.tile--landscape]="item.ratio === 'landscape'"
              [class.tile--tall]="item.ratio === 'tall'"
              [class.tile--wide]="item.ratio === 'wide'"
              [attr.aria-label]="'Deschide ' + item.title"
            >
              <img
                [src]="item.src"
                [alt]="item.alt"
                loading="lazy"
              />
              @if (item.featured) {
                <span class="absolute top-3 left-3 px-2 py-1 text-[9px] tracking-[0.3em] uppercase rounded-full glass-gold text-gold z-[2]">
                  ★ Recomandat
                </span>
              }
              <div class="absolute inset-0 flex flex-col justify-end p-4 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]">
                <div class="text-[10px] tracking-[0.4em] uppercase text-gold mb-1">
                  {{ item.category }} @if (item.year) { · {{ item.year }} }
                </div>
                <div class="font-display text-lg text-offwhite leading-tight">
                  {{ item.title }}
                </div>
                @if (item.location) {
                  <div class="text-[10px] text-offwhite/60 mt-0.5">📍 {{ item.location }}</div>
                }
              </div>
              <div class="absolute top-3 right-3 w-9 h-9 rounded-full glass-gold flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-[3]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4 text-gold">
                  <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m13-5v3a2 2 0 01-2 2h-3" stroke-linecap="round"/>
                </svg>
              </div>
            </button>
          }
        </div>

        @if (filteredItems().length === 0) {
          <div class="text-center py-20 text-offwhite/40">
            Niciun cadru în această categorie încă.
          </div>
        }
      </div>
    </section>

    <!-- =====================================================
         FINAL CTA
    ===================================================== -->
    <section class="relative section-padding bg-primary overflow-hidden">
      <div class="glow-orb glow-orb--gold w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25"></div>

      <div class="container-elegant relative text-center" fbReveal="fade">
        <div class="inline-flex items-center gap-4 mb-6">
          <span class="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold/50"></span>
          <span class="text-[11px] tracking-[0.5em] uppercase text-gold/80">Următorul cadru</span>
          <span class="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold/50"></span>
        </div>
        <h2 class="text-display text-4xl md:text-6xl text-offwhite mb-6 text-balance leading-[1.05]">
          Gata să devii
          <em class="text-gold-gradient not-italic">parte</em> din portofoliu?
        </h2>
        <p class="text-offwhite/60 max-w-xl mx-auto mb-8 leading-relaxed">
          Spune-ne despre momentul tău — îți răspundem personal în 24 de ore
          cu o ofertă croită exact pe povestea ta.
        </p>
        <a routerLink="/" fragment="contact" class="btn-primary inline-flex">
          Rezervă o Ședință
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4 ml-1">
            <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round"/>
          </svg>
        </a>
      </div>
    </section>

    <!-- =====================================================
         LIGHTBOX
    ===================================================== -->
    @if (lightboxIndex() !== null) {
      <div
        class="fixed inset-0 z-[9500] bg-primary/96 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in"
        (click)="closeLightbox()"
        role="dialog"
        aria-modal="true"
      >
        <button
          (click)="closeLightbox(); $event.stopPropagation()"
          class="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-offwhite hover:border-gold hover:text-gold transition-colors"
          aria-label="Închide"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
            <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/>
          </svg>
        </button>

        <button
          (click)="prev(); $event.stopPropagation()"
          class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-offwhite hover:border-gold hover:text-gold transition-colors"
          aria-label="Anterior"
        >‹</button>
        <button
          (click)="next(); $event.stopPropagation()"
          class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-offwhite hover:border-gold hover:text-gold transition-colors"
          aria-label="Următor"
        >›</button>

        <figure
          class="relative max-w-6xl max-h-[88vh] flex flex-col items-center gap-5"
          (click)="$event.stopPropagation()"
        >
          <img
            [src]="currentItem()?.src"
            [alt]="currentItem()?.alt"
            class="max-h-[75vh] w-auto rounded-xl object-contain smooth-shadow"
          />
          <figcaption class="text-center max-w-xl px-4">
            <div class="text-[10px] tracking-[0.4em] uppercase text-gold mb-2">
              {{ currentItem()?.category }}
              @if (currentItem()?.year) { · {{ currentItem()?.year }} }
              @if (currentItem()?.location) { · 📍 {{ currentItem()?.location }} }
            </div>
            <div class="font-display text-2xl md:text-3xl text-offwhite">
              {{ currentItem()?.title }}
            </div>
            <div class="mt-3 text-[10px] tracking-[0.3em] uppercase text-offwhite/40">
              {{ lightboxIndex()! + 1 }} / {{ filteredItems().length }}
            </div>
          </figcaption>
        </figure>
      </div>
    }
  `,
  styles: [`
    /* CSS-grid based masonry that respects aspect-ratio tiles */
    .portfolio-masonry {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-rows: 180px;
      gap: 0.75rem;
    }
    @media (min-width: 768px) {
      .portfolio-masonry {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        grid-auto-rows: 200px;
      }
    }
    @media (min-width: 1280px) {
      .portfolio-masonry {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        grid-auto-rows: 220px;
      }
    }

    .portfolio-tile {
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.02);
      border: 0;
      cursor: pointer;
      animation: tileIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
    }
    .portfolio-tile img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .tile--square { grid-row: span 1; grid-column: span 1; }
    .tile--portrait { grid-row: span 2; grid-column: span 1; }
    .tile--tall { grid-row: span 2; grid-column: span 1; }
    .tile--landscape { grid-row: span 1; grid-column: span 2; }
    .tile--wide { grid-row: span 1; grid-column: span 2; }

    @media (min-width: 768px) {
      .tile--portrait { grid-row: span 2; }
      .tile--tall { grid-row: span 2; }
      .tile--wide { grid-column: span 2; }
      .tile--landscape { grid-column: span 2; }
    }

    /* Stagger entrance */
    .portfolio-tile:nth-child(1) { animation-delay: 0.02s; }
    .portfolio-tile:nth-child(2) { animation-delay: 0.06s; }
    .portfolio-tile:nth-child(3) { animation-delay: 0.10s; }
    .portfolio-tile:nth-child(4) { animation-delay: 0.14s; }
    .portfolio-tile:nth-child(5) { animation-delay: 0.18s; }
    .portfolio-tile:nth-child(6) { animation-delay: 0.22s; }
    .portfolio-tile:nth-child(7) { animation-delay: 0.26s; }
    .portfolio-tile:nth-child(8) { animation-delay: 0.30s; }

    @keyframes tileIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.97);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `],
})
export class PortfolioPageComponent {
  private readonly scrollSvc = inject(ScrollService);

  // ------- State -------
  protected readonly activeCategory = signal<string>('Toate');
  protected readonly sort = signal<SortKey>('recent');
  protected readonly lightboxIndex = signal<number | null>(null);

  // ------- Stats -------
  protected readonly stats = {
    totalShots: 8200,
    totalEvents: 540,
  };

  protected readonly statCards = [
    { value: 8200, suffix: '+', label: 'Cadre livrate' },
    { value: 540, suffix: '+', label: 'Evenimente' },
    { value: 32, suffix: '', label: 'Destinații' },
    { value: 5, suffix: '+', label: 'Ani de atelier' },
  ];

  // ------- Hero collage -------
  protected readonly heroCollage = [
    'assets/hero/8D9A9999-339.jpg',
    'assets/hero/8D9A9999-6.jpg',
    'assets/hero/BUG07357-Enhanced-NR.jpg',
    'assets/hero/DSC02286.jpg',
    'assets/hero/DSC_9437.jpg',
    'assets/portfolio/nunta-1-16-9.jpg',
    'assets/portfolio/botez-1-16-9.jpg',
    'assets/portfolio/FOTO-BUGEAC-358.jpg',
  ];

  // ------- Categories (counts derived from items) -------
  protected readonly categories = computed<Category[]>(() => {
    const counts: Record<string, number> = {};
    for (const it of this.items) {
      counts[it.category] = (counts[it.category] || 0) + 1;
    }
    return [
      { id: 'all', label: 'Toate', count: this.items.length },
      { id: 'weddings', label: 'Nunți', count: counts['Nunți'] || 0 },
      { id: 'baptisms', label: 'Botezuri', count: counts['Botezuri'] || 0 },
      { id: 'family', label: 'Familie', count: counts['Familie'] || 0 },
      { id: 'events', label: 'Evenimente', count: counts['Evenimente'] || 0 },
    ];
  });

  // ------- Featured stories -------
  protected readonly featuredStories: FeaturedStory[] = [
    {
      id: 'nunta-aurora-andrei',
      title: 'O nuntă în cinematic',
      subtitle: 'Ceremonie & petrecere',
      date: '2024',
      cover: 'assets/portfolio/nunta-1-16-9.jpg',
      description: 'O zi de aur, cu lumină filtrată și emoție pe fiecare cadru.',
      count: 412,
      category: 'Nuntă',
    },
    {
      id: 'botez-familia',
      title: 'Botez în lumină caldă',
      subtitle: 'Familie, tandrețe, începuturi',
      date: '2024',
      cover: 'assets/portfolio/botez-1-16-9.jpg',
      description: 'Portret intim de familie, surprins într-o dimineață liniștită.',
      count: 96,
      category: 'Botez',
    },
    {
      id: 'eveniment-foto-bugeac',
      title: 'Atmosferă de seară',
      subtitle: 'Eveniment privat — Tecuci',
      date: '2024',
      cover: 'assets/portfolio/FOTO-BUGEAC-358.jpg',
      description: 'Documentar editorial pentru o seară elegantă cu invitați de seamă.',
      count: 268,
      category: 'Eveniment',
    },
  ];

  // ------- Items (real assets) -------
  protected readonly items: PortfolioItem[] = [
    // === Nunți (10) ===
    { id: 'w1', src: 'assets/portfolio/nunta-1-9-16.jpg',  alt: 'Mireasă în lumină',     category: 'Nunți', title: 'Promisiuni',     location: 'Tecuci', year: 2024, ratio: 'tall',      featured: true },
    { id: 'w2', src: 'assets/portfolio/nunta-1-16-9.jpg',  alt: 'Ceremonie de nuntă',    category: 'Nunți', title: 'Jurăminte',      location: 'Tecuci', year: 2024, ratio: 'wide',      featured: true },
    { id: 'w3', src: 'assets/portfolio/nunta-2-9-16.jpg',  alt: 'Portret mireasă',       category: 'Nunți', title: 'Lumina ei',                          year: 2024, ratio: 'portrait' },
    { id: 'w4', src: 'assets/portfolio/nunta-2-16-9.jpg',  alt: 'Cuplu pe pași',         category: 'Nunți', title: 'Primul pas',                         year: 2024, ratio: 'landscape' },
    { id: 'w5', src: 'assets/portfolio/nunta-3-9-16.jpg',  alt: 'Voal în vânt',          category: 'Nunți', title: 'Voalul',                             year: 2023, ratio: 'tall' },
    { id: 'w6', src: 'assets/portfolio/nunta-3-16-9.jpg',  alt: 'Mire & mireasă',        category: 'Nunți', title: 'Împreună',                           year: 2023, ratio: 'wide' },
    { id: 'w7', src: 'assets/portfolio/nunta-4-9-16.jpg',  alt: 'Detalii nuntă',         category: 'Nunți', title: 'Pentru Totdeauna',                   year: 2024, ratio: 'portrait', featured: true },
    { id: 'w8', src: 'assets/portfolio/nunta-4-16-9.jpg',  alt: 'Dans',                  category: 'Nunți', title: 'Dansul Mirilor',                     year: 2024, ratio: 'landscape' },
    { id: 'w9', src: 'assets/portfolio/nunta-5-9-16.jpg',  alt: 'Portret nuntă',         category: 'Nunți', title: 'Privirea',                           year: 2024, ratio: 'tall' },
    { id: 'w10', src: 'assets/portfolio/nunta-5-16-9.jpg', alt: 'Atmosferă nuntă',       category: 'Nunți', title: 'Petrecere',                          year: 2024, ratio: 'wide' },

    // === Botezuri (14) ===
    { id: 'b1', src: 'assets/portfolio/botez-1-9-16.jpg',     alt: 'Botez moment',         category: 'Botezuri', title: 'Începuturi',           year: 2024, ratio: 'tall',      featured: true },
    { id: 'b2', src: 'assets/portfolio/botez-1-16-9.jpg',     alt: 'Familie la botez',     category: 'Botezuri', title: 'Familia',              year: 2024, ratio: 'wide' },
    { id: 'b3', src: 'assets/portfolio/botez-2-9-16.jpg',     alt: 'Bebeluș',              category: 'Botezuri', title: 'Tăcere',               year: 2024, ratio: 'portrait' },
    { id: 'b4', src: 'assets/portfolio/botez-2-16-9.jpg',     alt: 'Botez ceremonie',      category: 'Botezuri', title: 'Cununița',             year: 2024, ratio: 'landscape' },
    { id: 'b5', src: 'assets/portfolio/botez-3-9-16.jpg',     alt: 'Botez detaliu',        category: 'Botezuri', title: 'Detalii',              year: 2023, ratio: 'tall' },
    { id: 'b6', src: 'assets/portfolio/botez-3-16-9.jpg',     alt: 'Botez sărbătoare',     category: 'Botezuri', title: 'Sărbătoare',           year: 2023, ratio: 'wide' },
    { id: 'b7', src: 'assets/portfolio/botez-4-9-16.jpg',     alt: 'Părinți și fiu',       category: 'Botezuri', title: 'Promisiuni',           year: 2024, ratio: 'portrait', featured: true },
    { id: 'b8', src: 'assets/portfolio/botez-5-9-16.jpg',     alt: 'Mâini de copil',       category: 'Botezuri', title: 'Mâinile',              year: 2024, ratio: 'tall' },
    { id: 'b9', src: 'assets/portfolio/botez-6-9-16.jpg',     alt: 'Botez intim',          category: 'Botezuri', title: 'Lumină Caldă',         year: 2024, ratio: 'portrait' },
    { id: 'b10', src: 'assets/portfolio/botez-7-9-16.jpg',    alt: 'Tăticul cu bebe',      category: 'Botezuri', title: 'Tata',                 year: 2024, ratio: 'tall' },
    { id: 'b11', src: 'assets/portfolio/botez-16-9 (1).jpg',  alt: 'Botez moment 1',       category: 'Botezuri', title: 'Apa Sfințirii',        year: 2024, ratio: 'landscape' },
    { id: 'b12', src: 'assets/portfolio/botez-16-9 (2).jpg',  alt: 'Botez moment 2',       category: 'Botezuri', title: 'Rugă',                 year: 2024, ratio: 'wide' },
    { id: 'b13', src: 'assets/portfolio/botez-16-9 (3).jpg',  alt: 'Botez moment 3',       category: 'Botezuri', title: 'Bucurie',              year: 2024, ratio: 'landscape' },
    { id: 'b14', src: 'assets/portfolio/botez-16-9 (4).jpg',  alt: 'Botez moment 4',       category: 'Botezuri', title: 'Toți Împreună',        year: 2024, ratio: 'wide' },

    // === Familie (mix din botez care arată familia) ===
    { id: 'f1', src: 'assets/portfolio/botez-1-16-9.jpg',     alt: 'Familie completă',     category: 'Familie',  title: 'Generații',            year: 2024, ratio: 'wide',      featured: true },
    { id: 'f2', src: 'assets/portfolio/botez-3-16-9.jpg',     alt: 'Părinți și copil',     category: 'Familie',  title: 'Cei trei',             year: 2024, ratio: 'landscape' },
    { id: 'f3', src: 'assets/portfolio/botez-4-9-16.jpg',     alt: 'Mama cu copilul',      category: 'Familie',  title: 'Tandrețe',             year: 2024, ratio: 'portrait' },
    { id: 'f4', src: 'assets/portfolio/botez-7-9-16.jpg',     alt: 'Tata cu bebelușul',    category: 'Familie',  title: 'Brațe Sigure',         year: 2024, ratio: 'tall' },

    // === Evenimente (FOTO-BUGEAC + atmosfere) ===
    { id: 'e1', src: 'assets/portfolio/FOTO-BUGEAC-358.jpg',         alt: 'Atmosferă eveniment', category: 'Evenimente', title: 'Soirée',              year: 2024, ratio: 'landscape', featured: true },
    { id: 'e2', src: 'assets/portfolio/FOTO-BUGEAC-313-of-321.jpg',  alt: 'Eveniment privat',    category: 'Evenimente', title: 'Atmosferă',           year: 2024, ratio: 'wide' },
    { id: 'e3', src: 'assets/portfolio/nunta-2-16-9.jpg',            alt: 'Petrecere nuntă',     category: 'Evenimente', title: 'Petrecere',           year: 2024, ratio: 'landscape' },
    { id: 'e4', src: 'assets/portfolio/botez-16-9 (2).jpg',          alt: 'Eveniment botez',     category: 'Evenimente', title: 'Sărbătoare',          year: 2024, ratio: 'wide' },
  ];

  // ------- Filtering + sorting -------
  protected readonly filteredItems = computed(() => {
    const cat = this.activeCategory();
    let list = cat === 'Toate' ? [...this.items] : this.items.filter((i) => i.category === cat);

    switch (this.sort()) {
      case 'featured':
        list = list.sort(
          (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
        );
        break;
      case 'name':
        list = list.sort((a, b) => a.title.localeCompare(b.title, 'ro'));
        break;
      case 'recent':
      default:
        list = list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        break;
    }
    return list;
  });

  protected readonly currentItem = computed(() => {
    const idx = this.lightboxIndex();
    if (idx === null) return null;
    return this.filteredItems()[idx] ?? null;
  });

  // ------- Actions -------
  protected setCategory(label: string): void {
    this.activeCategory.set(label);
  }
  protected setSort(s: SortKey): void {
    this.sort.set(s);
  }

  protected scrollToGallery(): void {
    this.scrollSvc.scrollTo('#gallery', -80);
  }

  protected openStory(story: FeaturedStory): void {
    // Set category filter to the story's category, scroll to gallery
    const map: Record<string, string> = {
      'Nuntă': 'Nunți',
      'Botez': 'Botezuri',
      'Eveniment': 'Evenimente',
    };
    this.activeCategory.set(map[story.category] ?? 'Toate');
    setTimeout(() => this.scrollSvc.scrollTo('#gallery', -80), 50);
  }

  // ------- Lightbox -------
  protected openLightbox(index: number): void {
    this.lightboxIndex.set(index);
    this.scrollSvc.stop();
  }

  protected closeLightbox(): void {
    this.lightboxIndex.set(null);
    this.scrollSvc.start();
  }

  protected next(): void {
    const idx = this.lightboxIndex();
    if (idx === null) return;
    const total = this.filteredItems().length;
    this.lightboxIndex.set((idx + 1) % total);
  }

  protected prev(): void {
    const idx = this.lightboxIndex();
    if (idx === null) return;
    const total = this.filteredItems().length;
    this.lightboxIndex.set((idx - 1 + total) % total);
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (this.lightboxIndex() === null) return;
    if (e.key === 'Escape') this.closeLightbox();
    else if (e.key === 'ArrowRight') this.next();
    else if (e.key === 'ArrowLeft') this.prev();
  }

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}
}
