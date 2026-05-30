import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../core/services/gallery.service';
import { GalleryCategory, GalleryImage } from '../../core/models/api.models';
import { RevealDirective } from '../../shared/directives/reveal.directive';

interface CatTab { id: GalleryCategory | 'all'; label: string; }

const FALLBACK: GalleryImage[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', category: 'lac', title: 'Apus pe lac', sort_order: 0, is_published: true, created_at: '', thumbnail_url: null },
  { id: 2, url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80', category: 'cort', title: 'Cort premium', sort_order: 0, is_published: true, created_at: '', thumbnail_url: null },
  { id: 3, url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80', category: 'exterior', title: 'Alei iluminate', sort_order: 0, is_published: true, created_at: '', thumbnail_url: null },
  { id: 4, url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80', category: 'lac', title: 'Pontoane', sort_order: 0, is_published: true, created_at: '', thumbnail_url: null },
  { id: 5, url: 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=1200&q=80', category: 'lac', title: 'Barcă foto', sort_order: 0, is_published: true, created_at: '', thumbnail_url: null },
  { id: 6, url: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&w=1200&q=80', category: 'nunti', title: 'Cununie pe ponton', sort_order: 0, is_published: true, created_at: '', thumbnail_url: null },
  { id: 7, url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', category: 'nunti', title: 'Decor de seară', sort_order: 0, is_published: true, created_at: '', thumbnail_url: null },
  { id: 8, url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80', category: 'petreceri', title: 'Petrecere privată', sort_order: 0, is_published: true, created_at: '', thumbnail_url: null },
  { id: 9, url: 'https://images.unsplash.com/photo-1462536943532-57a629f6cc60?auto=format&fit=crop&w=1200&q=80', category: 'botezuri', title: 'Botez elegant', sort_order: 0, is_published: true, created_at: '', thumbnail_url: null },
  { id: 10, url: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=1200&q=80', category: 'sala', title: 'Sala interioară', sort_order: 0, is_published: true, created_at: '', thumbnail_url: null },
  { id: 11, url: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf5b?auto=format&fit=crop&w=1200&q=80', category: 'cort', title: 'Atmosferă de seară', sort_order: 0, is_published: true, created_at: '', thumbnail_url: null },
  { id: 12, url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80', category: 'exterior', title: 'Foto loc romantic', sort_order: 0, is_published: true, created_at: '', thumbnail_url: null }
];

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pt-40 pb-12">
      <div class="container-luxe px-6">
        <span class="eyebrow">Galerie</span>
        <h1 class="mt-4 font-display text-5xl md:text-7xl text-white">Atmosfera, surprinsă <span class="gold-text">cinematic</span>.</h1>
        <p class="mt-6 text-white/70 max-w-2xl text-lg">O selecție din evenimentele Mirtanis — cort, sală, lac, pontoane și momentele dintre.</p>

        <div class="mt-12 flex flex-wrap gap-2">
          <button *ngFor="let t of tabs"
                  (click)="setCategory(t.id)"
                  [class.bg-gold-400]="active() === t.id"
                  [class.text-ink-950]="active() === t.id"
                  [class.bg-white]="false"
                  [class.text-white]="active() !== t.id"
                  class="px-5 py-2.5 rounded-full border border-white/10 hover:border-gold-400/60 text-sm tracking-wider uppercase transition-all duration-500">
            {{ t.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="pb-32">
      <div class="container-luxe px-6">
        <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          <figure *ngFor="let img of visible(); let i = index" appReveal [revealDelay]="(i % 6) * 60"
                  (click)="open(img)"
                  class="group break-inside-avoid mb-6 cursor-zoom-in img-cine relative">
            <img [src]="img.url" [alt]="img.title || 'Mirtanis Events'" loading="lazy"
                 class="w-full h-auto block" />
            <figcaption class="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-ink-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span class="eyebrow text-gold-300">{{ img.category }}</span>
              <p class="font-display text-xl text-white">{{ img.title }}</p>
            </figcaption>
          </figure>
        </div>
        <p *ngIf="!visible().length" class="text-center text-white/50">Nu există imagini în această categorie.</p>
      </div>
    </section>

    <!-- Lightbox -->
    <div *ngIf="lightbox()" (click)="close()"
         class="fixed inset-0 z-[80] bg-ink-950/95 backdrop-blur-xl flex items-center justify-center p-6 animate-[routeIn_.5s_ease]">
      <button class="absolute top-6 right-6 text-white/70 hover:text-gold-300 text-3xl" aria-label="Close" (click)="close()">×</button>
      <img [src]="lightbox()!.url" [alt]="lightbox()!.title || ''" class="max-h-[88vh] max-w-[92vw] object-contain rounded-2xl shadow-glow-gold" />
    </div>
  `
})
export class GalleryComponent implements OnInit {
  private readonly gallery = inject(GalleryService);

  readonly tabs: CatTab[] = [
    { id: 'all', label: 'Toate' },
    { id: 'nunti', label: 'Nunți' },
    { id: 'botezuri', label: 'Botezuri' },
    { id: 'petreceri', label: 'Petreceri' },
    { id: 'cort', label: 'Cort' },
    { id: 'sala', label: 'Sala' },
    { id: 'lac', label: 'Lac' },
    { id: 'exterior', label: 'Exterior' }
  ];

  readonly active = signal<GalleryCategory | 'all'>('all');
  readonly images = signal<GalleryImage[]>([]);
  readonly lightbox = signal<GalleryImage | null>(null);

  readonly visible = () => {
    const cat = this.active();
    const all = this.images();
    return cat === 'all' ? all : all.filter((i) => i.category === cat);
  };

  ngOnInit(): void {
    this.gallery.list().subscribe({
      next: (rows) => {
        const resolved = rows.map((r) => ({ ...r, url: this.gallery.resolveUrl(r.url) }));
        this.images.set(resolved.length ? resolved : FALLBACK);
      },
      error: () => this.images.set(FALLBACK)
    });
  }

  setCategory(c: GalleryCategory | 'all'): void { this.active.set(c); }
  open(img: GalleryImage): void { this.lightbox.set(img); document.body.style.overflow = 'hidden'; }
  close(): void { this.lightbox.set(null); document.body.style.overflow = ''; }
}
