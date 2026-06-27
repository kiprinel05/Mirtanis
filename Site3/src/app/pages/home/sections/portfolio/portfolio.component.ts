import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../../../core/directives/reveal-on-scroll.directive';
import { ScrollService } from '../../../../core/services/scroll.service';

interface PortfolioItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  size: 'square' | 'tall' | 'wide';
}

@Component({
  selector: 'fb-portfolio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RevealOnScrollDirective],
  template: `
    <section
      id="portfolio"
      class="relative section-padding bg-secondary overflow-hidden"
      aria-label="Portofoliu"
    >
      <div
        class="glow-orb glow-orb--gold w-[600px] h-[600px] top-1/3 -left-64 opacity-20"
      ></div>

      <div class="container-elegant relative">
        <!-- Header -->
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12"
          fbReveal="fade"
        >
          <div>
            <div
              class="inline-flex items-center gap-3 mb-4 text-[11px] tracking-[0.4em] uppercase text-gold/80"
            >
              <span class="h-[1px] w-10 bg-gold/40"></span>
              <span>Lucrări selectate</span>
            </div>
            <h2
              class="text-display text-5xl md:text-6xl lg:text-7xl text-offwhite text-balance leading-[0.95]"
            >
              O <em class="text-gold-gradient not-italic">galerie</em>
              <br />de cadre eterne.
            </h2>
          </div>
          <p class="text-offwhite/60 max-w-md text-balance">
            O privire asupra momentelor pe care am avut încrederea să le
            surprindem. Apasă pe orice imagine pentru vizualizarea
            cinematografică.
          </p>
        </div>

        <!-- Filters -->
        <div
          class="flex flex-wrap items-center gap-2 mb-10"
          fbReveal="fade"
          role="tablist"
        >
          @for (cat of categories; track cat) {
            <button
              role="tab"
              [attr.aria-selected]="activeCategory() === cat"
              (click)="setCategory(cat)"
              class="px-5 py-2 rounded-full text-xs tracking-[0.2em] uppercase font-medium transition-all duration-500"
              [class]="
                activeCategory() === cat
                  ? 'bg-gold text-primary shadow-glow'
                  : 'border border-white/10 text-offwhite/70 hover:border-gold/60 hover:text-gold'
              "
            >
              {{ cat }}
            </button>
          }
        </div>

        <!-- Masonry grid -->
        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] gap-4"
          [class.is-filtered]="activeCategory() !== 'Toate'"
          fbReveal="stagger"
        >
          @for (item of filteredItems(); track item.id) {
            <button
              (click)="open(item)"
              class="group relative overflow-hidden rounded-2xl img-cinematic focus:outline-none"
              [class.row-span-2]="item.size === 'tall'"
              [class.col-span-2]="item.size === 'wide'"
              [attr.aria-label]="'Vezi ' + item.title"
            >
              <img
                [src]="item.src"
                [alt]="item.alt"
                loading="lazy"
              />
              <div
                class="absolute inset-0 flex flex-col justify-end p-5 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]"
              >
                <div
                  class="text-[10px] tracking-[0.4em] uppercase text-gold mb-1"
                >
                  {{ item.category }}
                </div>
                <div class="font-display text-xl text-offwhite">
                  {{ item.title }}
                </div>
              </div>
              <div
                class="absolute top-3 right-3 w-10 h-10 rounded-full glass-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 z-[3]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  class="w-4 h-4 text-gold"
                >
                  <path
                    d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m13-5v3a2 2 0 01-2 2h-3"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
            </button>
          }
        </div>

        <!-- View all -->
        <div class="text-center mt-12" fbReveal="fade">
          <a routerLink="/portfolio" class="btn-outline">
            Vezi Portofoliul Complet
          </a>
        </div>
      </div>

      <!-- Lightbox -->
      @if (lightbox()) {
        <div
          class="fixed inset-0 z-[9500] bg-primary/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in"
          (click)="close()"
          role="dialog"
          aria-modal="true"
        >
          <button
            class="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-offwhite hover:border-gold hover:text-gold transition-colors"
            (click)="close(); $event.stopPropagation()"
            aria-label="Închide"
          >
            ✕
          </button>

          <button
            class="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-offwhite hover:border-gold hover:text-gold transition-colors"
            (click)="prev(); $event.stopPropagation()"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            class="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-offwhite hover:border-gold hover:text-gold transition-colors"
            (click)="next(); $event.stopPropagation()"
            aria-label="Următor"
          >
            ›
          </button>

          <figure
            class="max-w-5xl max-h-[85vh] flex flex-col items-center gap-4"
            (click)="$event.stopPropagation()"
          >
            <img
              [src]="lightbox()!.src"
              [alt]="lightbox()!.alt"
              class="max-h-[75vh] w-auto rounded-xl object-contain smooth-shadow"
            />
            <figcaption class="text-center">
              <div
                class="text-[10px] tracking-[0.4em] uppercase text-gold mb-1"
              >
                {{ lightbox()!.category }}
              </div>
              <div class="font-display text-2xl text-offwhite">
                {{ lightbox()!.title }}
              </div>
            </figcaption>
          </figure>
        </div>
      }
    </section>
  `,
})
export class PortfolioComponent {
  protected readonly categories = [
    'Toate',
    'Nunți',
    'Botezuri',
    'Familie',
    'Evenimente',
  ];

  protected readonly activeCategory = signal('Toate');
  protected readonly lightbox = signal<PortfolioItem | null>(null);

  protected readonly items: PortfolioItem[] = [
    { id: '1',  src: 'assets/portfolio/nunta-1-9-16.jpg',   alt: 'Moment de nuntă',         category: 'Nunți',      title: 'Promisiuni',    size: 'tall' },
    { id: '2',  src: 'assets/portfolio/nunta-1-16-9.jpg',   alt: 'Ceremonie de nuntă',      category: 'Nunți',      title: 'Jurăminte',     size: 'wide' },
    { id: '3',  src: 'assets/portfolio/botez-1-9-16.jpg',   alt: 'Moment de botez',         category: 'Botezuri',   title: 'Începuturi',    size: 'tall' },
    { id: '4',  src: 'assets/portfolio/botez-1-16-9.jpg',   alt: 'Familie la botez',        category: 'Familie',    title: 'Prima Lumină',  size: 'wide' },
    { id: '5',  src: 'assets/portfolio/nunta-2-9-16.jpg',   alt: 'Portret de mireasă',      category: 'Nunți',      title: 'Lumina ei',     size: 'tall' },
    { id: '6',  src: 'assets/portfolio/botez-2-9-16.jpg',   alt: 'Botez detaliu',           category: 'Botezuri',   title: 'Tăcere',        size: 'square' },
    { id: '7',  src: 'assets/portfolio/nunta-3-16-9.jpg',   alt: 'Detalii de nuntă',        category: 'Nunți',      title: 'Voalul',        size: 'wide' },
    { id: '8',  src: 'assets/portfolio/botez-3-9-16.jpg',   alt: 'Botez momente',           category: 'Botezuri',   title: 'Sărbătoare',    size: 'square' },
    { id: '9',  src: 'assets/portfolio/nunta-4-9-16.jpg',   alt: 'Sărut de nuntă',          category: 'Nunți',      title: 'Pentru Totdeauna', size: 'square' },
    { id: '10', src: 'assets/portfolio/botez-16-9 (1).jpg', alt: 'Petrecere de botez',      category: 'Evenimente', title: 'Soirée',        size: 'wide' },
    { id: '11', src: 'assets/portfolio/nunta-5-9-16.jpg',   alt: 'Portret cuplu',           category: 'Familie',    title: 'Îmbrățișare',   size: 'tall' },
    { id: '12', src: 'assets/portfolio/FOTO-BUGEAC-358.jpg', alt: 'Eveniment',              category: 'Evenimente', title: 'Atmosferă',     size: 'square' },
  ];

  protected readonly filteredItems = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'Toate') return this.items;
    return this.items.filter((i) => i.category === cat);
  });

  protected setCategory(cat: string): void {
    this.activeCategory.set(cat);
  }

  private readonly scrollSvc = inject(ScrollService);

  protected open(item: PortfolioItem): void {
    this.lightbox.set(item);
    this.scrollSvc.stop();
  }

  protected close(): void {
    this.lightbox.set(null);
    this.scrollSvc.start();
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (!this.lightbox()) return;
    if (e.key === 'Escape') this.close();
    else if (e.key === 'ArrowRight') this.next();
    else if (e.key === 'ArrowLeft') this.prev();
  }

  protected next(): void {
    const list = this.filteredItems();
    const current = this.lightbox();
    if (!current) return;
    const idx = list.findIndex((i) => i.id === current.id);
    this.lightbox.set(list[(idx + 1) % list.length]);
  }

  protected prev(): void {
    const list = this.filteredItems();
    const current = this.lightbox();
    if (!current) return;
    const idx = list.findIndex((i) => i.id === current.id);
    this.lightbox.set(list[(idx - 1 + list.length) % list.length]);
  }
}
