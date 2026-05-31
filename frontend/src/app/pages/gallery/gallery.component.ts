import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { GalleryService } from '../../core/services/gallery.service';
import { GalleryCategory, GalleryImage } from '../../core/models/api.models';
import { IMAGES } from '../../shared/data/images';

interface Photo { url: string; title?: string | null; category: string; }

const CATEGORIES: { key: GalleryCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Toate' },
  { key: 'nunti', label: 'Nunți' },
  { key: 'botezuri', label: 'Botezuri' },
  { key: 'petreceri', label: 'Petreceri' },
  { key: 'cort', label: 'Cort' },
  { key: 'sala', label: 'Sală' },
  { key: 'lac', label: 'Lac' },
  { key: 'exterior', label: 'Exterior' }
];

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [PageHeaderComponent, RevealDirective],
  template: `
    <app-page-header
      eyebrow="Galerie"
      title="Momente surprinse la Mirtanis"
      subtitle="O selecție din evenimentele care au prins viață pe malul lacului."
      [image]="headerImg" />

    <section class="section">
      <div class="container-x">
        <!-- Filters -->
        <div class="mb-10 flex flex-wrap justify-center gap-2 sm:gap-3">
          @for (c of categories; track c.key) {
            <button (click)="select(c.key)"
                    class="rounded-full border px-4 py-2 text-sm transition-all tap-highlight-none"
                    [class.border-gold-500]="active() === c.key"
                    [class.bg-gold-500]="active() === c.key"
                    [class.text-cream-50]="active() === c.key"
                    [class.border-cream-400]="active() !== c.key"
                    [class.text-ink-600]="active() !== c.key"
                    [class.hover:border-gold-400]="active() !== c.key">
              {{ c.label }}
            </button>
          }
        </div>

        @if (loading()) {
          <div class="columns-1 gap-4 sm:columns-2 lg:columns-3">
            @for (s of skeletons; track $index) {
              <div class="mb-4 animate-pulse rounded-2xl bg-cream-300" [style.height.px]="s"></div>
            }
          </div>
        } @else if (filtered().length === 0) {
          <p class="py-16 text-center text-ink-500">Nicio imagine în această categorie.</p>
        } @else {
          <div class="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]"
               appReveal="up" [revealStagger]="60">
            @for (p of filtered(); track p.url; let i = $index) {
              <figure class="img-cine group relative mb-4 break-inside-avoid cursor-pointer rounded-2xl shadow-soft"
                      (click)="open(i)">
                <img [src]="p.url" [alt]="p.title || 'Fotografie eveniment'" loading="lazy" class="w-full" />
                <figcaption class="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink-900/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <span class="text-sm text-cream-50">{{ p.title || labelFor(p.category) }}</span>
                </figcaption>
              </figure>
            }
          </div>
        }
      </div>
    </section>

    <!-- Lightbox -->
    @if (lightbox() !== null) {
      <div class="fixed inset-0 z-[80] flex items-center justify-center bg-ink-900/90 p-4 backdrop-blur-sm" (click)="close()">
        <button class="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-cream-50/10 text-cream-50 hover:bg-cream-50/20"
                (click)="close(); $event.stopPropagation()" aria-label="Închide"><span class="mi text-[24px]">close</span></button>
        <button class="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-cream-50/10 text-cream-50 hover:bg-cream-50/20 sm:left-8"
                (click)="prev(); $event.stopPropagation()" aria-label="Anterioara"><span class="mi text-[28px]">chevron_left</span></button>
        <img [src]="filtered()[lightbox()!].url" [alt]="filtered()[lightbox()!].title || ''"
             class="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-lift" (click)="$event.stopPropagation()" />
        <button class="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-cream-50/10 text-cream-50 hover:bg-cream-50/20 sm:right-8"
                (click)="next(); $event.stopPropagation()" aria-label="Următoarea"><span class="mi text-[28px]">chevron_right</span></button>
      </div>
    }
  `
})
export class GalleryComponent implements OnInit {
  private readonly api = inject(GalleryService);

  readonly headerImg = IMAGES.heroAlt;
  readonly categories = CATEGORIES;
  readonly skeletons = [240, 320, 280, 360, 220, 300, 260, 340, 300];

  readonly photos = signal<Photo[]>([]);
  readonly active = signal<GalleryCategory | 'all'>('all');
  readonly loading = signal(true);
  readonly lightbox = signal<number | null>(null);

  readonly filtered = computed(() => {
    const a = this.active();
    const all = this.photos();
    return a === 'all' ? all : all.filter((p) => p.category === a);
  });

  ngOnInit(): void {
    this.api.list().subscribe({
      next: (imgs: GalleryImage[]) => {
        if (imgs && imgs.length) {
          this.photos.set(imgs.map((i) => ({
            url: this.api.resolveUrl(i.url),
            title: i.title,
            category: i.category
          })));
        } else {
          this.photos.set(this.fallback());
        }
        this.loading.set(false);
      },
      error: () => { this.photos.set(this.fallback()); this.loading.set(false); }
    });
  }

  private fallback(): Photo[] {
    const cats = ['nunti', 'botezuri', 'cort', 'sala', 'lac', 'exterior', 'petreceri'];
    return IMAGES.gallery.map((url, i) => ({ url, category: cats[i % cats.length] }));
  }

  select(key: GalleryCategory | 'all'): void { this.active.set(key); }

  labelFor(cat: string): string {
    return CATEGORIES.find((c) => c.key === cat)?.label ?? 'Mirtanis Events';
  }

  open(i: number): void { this.lightbox.set(i); document.body.style.overflow = 'hidden'; }
  close(): void { this.lightbox.set(null); document.body.style.overflow = ''; }
  next(): void { this.lightbox.update((v) => v === null ? v : (v + 1) % this.filtered().length); }
  prev(): void { this.lightbox.update((v) => v === null ? v : (v - 1 + this.filtered().length) % this.filtered().length); }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (this.lightbox() === null) return;
    if (e.key === 'Escape') this.close();
    if (e.key === 'ArrowRight') this.next();
    if (e.key === 'ArrowLeft') this.prev();
  }
}
