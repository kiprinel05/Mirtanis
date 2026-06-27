import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  Inject,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { GalleryApiService } from '../../core/services/gallery-api.service';
import { FavoritesService } from '../../core/services/favorites.service';
import {
  GalleryImageOut,
  PublicEventOut,
} from '../../shared/models/gallery.models';

type ViewState = 'loading' | 'password' | 'ready' | 'error';

@Component({
  selector: 'fb-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section
      class="relative min-h-screen bg-primary text-offwhite pt-28 pb-24 px-4 md:px-8"
    >
      <div class="glow-orb glow-orb--gold w-[600px] h-[600px] -top-48 -right-48 opacity-25"></div>

      <div class="container-elegant relative">
        @switch (state()) {
          @case ('loading') {
            <div class="text-center py-24">
              <div class="inline-block w-12 h-12 rounded-full border-2 border-gold/30 border-t-gold animate-spin"></div>
              <p class="mt-6 text-offwhite/60 text-sm tracking-widest uppercase">Se încarcă galeria…</p>
            </div>
          }

          @case ('error') {
            <div class="max-w-lg mx-auto text-center py-24">
              <h1 class="font-display text-4xl text-offwhite mb-4">Galerie indisponibilă</h1>
              <p class="text-offwhite/60">{{ errorMessage() }}</p>
              <a routerLink="/" class="btn-outline mt-8 inline-flex">Înapoi acasă</a>
            </div>
          }

          @case ('password') {
            <div class="max-w-md mx-auto glass-strong rounded-2xl p-8 md:p-10">
              <div class="text-center mb-7">
                <div class="inline-flex w-14 h-14 rounded-full border border-gold/40 items-center justify-center text-gold mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-6 h-6">
                    <rect x="4" y="11" width="16" height="10" rx="2"/>
                    <path d="M8 11V8a4 4 0 118 0v3" stroke-linecap="round"/>
                  </svg>
                </div>
                <h1 class="font-display text-3xl text-offwhite mb-2">{{ event()?.title }}</h1>
                <p class="text-offwhite/60 text-sm">Această galerie este protejată cu parolă.</p>
              </div>

              <form (submit)="submitPassword($event)" class="space-y-4">
                <label class="block">
                  <span class="text-xs tracking-[0.3em] uppercase text-offwhite/50">Parolă</span>
                  <input
                    type="password"
                    [(ngModel)]="password"
                    name="password"
                    required
                    autocomplete="off"
                    class="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-offwhite focus:outline-none focus:border-gold"
                  />
                </label>
                @if (passwordError()) {
                  <p class="text-xs text-red-400">{{ passwordError() }}</p>
                }
                <button type="submit" class="btn-primary w-full">Deschide galeria</button>
              </form>
            </div>
          }

          @case ('ready') {
            <ng-container *ngTemplateOutlet="gallery"></ng-container>
          }
        }
      </div>
    </section>

    <ng-template #gallery>
      <!-- Header -->
      <header class="mb-12 text-center max-w-3xl mx-auto">
        <p class="text-[11px] tracking-[0.4em] uppercase text-gold/80 mb-3">
          Galerie privată · Foto Bugeac
        </p>
        <h1 class="text-display text-4xl md:text-6xl text-offwhite mb-3 leading-[1.05]">
          {{ event()?.title }}
        </h1>
        @if (event()?.client_name) {
          <p class="text-offwhite/70">{{ event()?.client_name }}</p>
        }
        @if (event()?.event_date) {
          <p class="text-[11px] tracking-[0.3em] uppercase text-offwhite/40 mt-2">
            {{ formatDate(event()!.event_date!) }}
          </p>
        }
        @if (event()?.description) {
          <p class="mt-6 text-offwhite/65 leading-relaxed">{{ event()?.description }}</p>
        }
      </header>

      <!-- Toolbar -->
      <div class="sticky top-24 z-30 flex flex-wrap gap-3 items-center justify-between mb-8 glass-strong rounded-2xl px-5 py-3">
        <div class="flex items-center gap-4 text-xs">
          <span class="text-offwhite/60">
            <strong class="text-offwhite">{{ images().length }}</strong> cadre
          </span>
          @if (event()?.allow_favorites) {
            <span class="text-offwhite/60">
              <strong class="text-gold">{{ favoriteIds().length }}</strong> favorite
            </span>
          }
        </div>

        <div class="flex flex-wrap items-center gap-2">
          @if (event()?.allow_favorites && favoriteIds().length > 0) {
            <button
              (click)="downloadFavorites()"
              [disabled]="downloading()"
              class="px-4 py-2 rounded-full text-xs tracking-[0.2em] uppercase border border-gold/40 text-gold hover:bg-gold hover:text-primary transition-all disabled:opacity-50"
            >
              ⭐ Descarcă favorite ({{ favoriteIds().length }})
            </button>
          }
          @if (event()?.allow_download) {
            <button
              (click)="downloadAll()"
              [disabled]="downloading()"
              class="btn-primary text-xs disabled:opacity-50"
            >
              @if (downloading()) {
                Se pregătește…
              } @else {
                Descarcă toate
              }
            </button>
          }
        </div>
      </div>

      <!-- Masonry grid -->
      @if (images().length === 0) {
        <div class="text-center py-24 text-offwhite/40">
          Nicio fotografie încă în această galerie.
        </div>
      } @else {
        <div class="masonry">
          @for (img of images(); track img.id; let i = $index) {
            <figure
              class="masonry-item group relative overflow-hidden rounded-xl cursor-pointer"
              [style.aspectRatio]="getRatio(img)"
              (click)="openLightbox(i)"
            >
              <img
                [src]="img.thumb_url"
                [alt]="img.filename"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"></div>

              @if (event()?.allow_favorites) {
                <button
                  (click)="toggleFavorite(img, $event)"
                  [class.is-fav]="isFavorite(img.id)"
                  class="fav-btn absolute top-3 right-3 w-10 h-10 rounded-full glass-strong flex items-center justify-center transition-all"
                  [attr.aria-label]="isFavorite(img.id) ? 'Elimină din favorite' : 'Adaugă la favorite'"
                >
                  <svg viewBox="0 0 24 24" class="w-5 h-5 transition-colors"
                    [attr.fill]="isFavorite(img.id) ? '#D4AF37' : 'none'"
                    stroke="currentColor" stroke-width="1.5">
                    <path d="M12 21s-7-4.5-7-11a4 4 0 017-2.6A4 4 0 0119 10c0 6.5-7 11-7 11z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              }

              @if (event()?.allow_download) {
                <button
                  (click)="downloadOne(img, $event)"
                  class="absolute bottom-3 right-3 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-offwhite hover:text-gold opacity-0 group-hover:opacity-100 transition-all"
                  aria-label="Descarcă"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
                    <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              }
            </figure>
          }
        </div>
      }

      <!-- Lightbox -->
      @if (lightboxIndex() !== null) {
        <div
          class="fixed inset-0 z-[9500] bg-primary/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
          (click)="closeLightbox()"
        >
          <button
            (click)="closeLightbox(); $event.stopPropagation()"
            class="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-offwhite hover:border-gold hover:text-gold"
            aria-label="Închide"
          >✕</button>

          <button
            (click)="prevImage(); $event.stopPropagation()"
            class="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-offwhite hover:border-gold hover:text-gold"
            aria-label="Anterior"
          >‹</button>

          <button
            (click)="nextImage(); $event.stopPropagation()"
            class="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-offwhite hover:border-gold hover:text-gold"
            aria-label="Următor"
          >›</button>

          <img
            [src]="currentImage()?.preview_url"
            [alt]="currentImage()?.filename"
            class="max-h-[80vh] max-w-full rounded-xl object-contain smooth-shadow"
            (click)="$event.stopPropagation()"
          />

          <div
            class="mt-6 flex items-center gap-3 text-sm text-offwhite/70"
            (click)="$event.stopPropagation()"
          >
            <span>{{ currentImage()?.filename }}</span>
            <span class="text-gold">·</span>
            <span>{{ lightboxIndex()! + 1 }} / {{ images().length }}</span>
            @if (event()?.allow_favorites) {
              <button
                (click)="toggleFavorite(currentImage()!, $event)"
                class="ml-2 text-gold hover:scale-110 transition-transform"
                [attr.aria-label]="isFavorite(currentImage()!.id) ? 'Elimină din favorite' : 'Adaugă la favorite'"
              >
                <svg viewBox="0 0 24 24" class="w-5 h-5"
                  [attr.fill]="isFavorite(currentImage()!.id) ? '#D4AF37' : 'none'"
                  stroke="currentColor" stroke-width="1.5">
                  <path d="M12 21s-7-4.5-7-11a4 4 0 017-2.6A4 4 0 0119 10c0 6.5-7 11-7 11z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            }
            @if (event()?.allow_download) {
              <button
                (click)="downloadOne(currentImage()!, $event)"
                class="ml-2 text-gold hover:scale-110 transition-transform"
                aria-label="Descarcă"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
                  <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            }
          </div>
        </div>
      }
    </ng-template>
  `,
  styles: [
    `
      .masonry {
        column-count: 2;
        column-gap: 1rem;
      }
      @media (min-width: 768px) {
        .masonry { column-count: 3; }
      }
      @media (min-width: 1280px) {
        .masonry { column-count: 4; }
      }
      .masonry-item {
        break-inside: avoid;
        margin-bottom: 1rem;
        display: block;
      }
      .fav-btn.is-fav {
        background: rgba(212, 175, 55, 0.18);
        border-color: rgba(212, 175, 55, 0.4);
      }
    `,
  ],
})
export class GalleryComponent implements OnInit, OnDestroy {
  private readonly api = inject(GalleryApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly favorites = inject(FavoritesService);

  protected readonly state = signal<ViewState>('loading');
  protected readonly errorMessage = signal('');
  protected readonly event = signal<PublicEventOut | null>(null);
  protected readonly images = signal<GalleryImageOut[]>([]);
  protected readonly lightboxIndex = signal<number | null>(null);
  protected readonly downloading = signal(false);
  protected readonly passwordError = signal('');
  protected password = '';

  private slug = '';

  protected readonly favoriteIds = computed(() => {
    const slug = this.event()?.slug;
    if (!slug) return [];
    return this.favorites.forEvent(slug)();
  });

  protected readonly currentImage = computed(() => {
    const idx = this.lightboxIndex();
    if (idx === null) return null;
    return this.images()[idx] ?? null;
  });

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') ?? '';
    if (!this.slug) {
      this.fail('Link invalid.');
      return;
    }
    this.loadEvent();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  private async loadEvent(): Promise<void> {
    try {
      const event = await firstValueFrom(this.api.getEvent(this.slug));
      this.event.set(event);
      if (event.requires_password) {
        this.state.set('password');
      } else {
        await this.loadImages();
        this.state.set('ready');
      }
    } catch (e: unknown) {
      const err = e as { status?: number; error?: { detail?: unknown } };
      const rawDetail = err?.error?.detail;
      const detail =
        typeof rawDetail === 'string'
          ? rawDetail
          : Array.isArray(rawDetail)
          ? rawDetail
              .map((it: { msg?: string }) => it?.msg || 'invalid')
              .join(' · ')
          : null;
      if (err?.status === 410) {
        this.fail(detail || 'Această galerie nu mai este disponibilă.');
      } else if (err?.status === 404) {
        this.fail('Link-ul galeriei nu este valid.');
      } else {
        this.fail(detail || 'A apărut o eroare. Încearcă din nou.');
      }
    }
  }

  private async loadImages(): Promise<void> {
    const list = await firstValueFrom(this.api.listImages(this.slug));
    this.images.set(list);
  }

  protected async submitPassword(e: Event): Promise<void> {
    e.preventDefault();
    this.passwordError.set('');
    try {
      const res = await firstValueFrom(this.api.unlock(this.slug, this.password));
      this.api.setGalleryToken(res.access_token);
      await this.loadImages();
      this.state.set('ready');
    } catch (err: unknown) {
      const e = err as { error?: { detail?: string } };
      this.passwordError.set(e?.error?.detail || 'Parolă incorectă.');
    }
  }

  protected getRatio(img: GalleryImageOut): string {
    if (img.width && img.height) return `${img.width} / ${img.height}`;
    return '3 / 4';
  }

  protected formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString('ro-RO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  }

  // ---- Favorites ----
  protected isFavorite(imageId: string): boolean {
    return this.favorites.isFavorite(this.slug, imageId);
  }

  protected toggleFavorite(img: GalleryImageOut, e: Event): void {
    e.stopPropagation();
    this.favorites.toggle(this.slug, img.id);
  }

  // ---- Lightbox ----
  protected openLightbox(index: number): void {
    this.lightboxIndex.set(index);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  protected closeLightbox(): void {
    this.lightboxIndex.set(null);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  protected prevImage(): void {
    const idx = this.lightboxIndex();
    if (idx === null) return;
    const total = this.images().length;
    this.lightboxIndex.set((idx - 1 + total) % total);
  }

  protected nextImage(): void {
    const idx = this.lightboxIndex();
    if (idx === null) return;
    this.lightboxIndex.set((idx + 1) % this.images().length);
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (this.lightboxIndex() === null) return;
    if (e.key === 'Escape') this.closeLightbox();
    else if (e.key === 'ArrowRight') this.nextImage();
    else if (e.key === 'ArrowLeft') this.prevImage();
  }

  // ---- Downloads ----
  protected async downloadOne(img: GalleryImageOut, e: Event): Promise<void> {
    e.stopPropagation();
    if (img.download_url) {
      this.triggerDownload(img.download_url, img.filename);
      return;
    }
    try {
      const res = await firstValueFrom(this.api.downloadSingle(this.slug, img.id));
      this.triggerDownload(res.url, res.filename);
    } catch {
      /* swallow */
    }
  }

  protected async downloadAll(): Promise<void> {
    await this.downloadZip([]);
  }

  protected async downloadFavorites(): Promise<void> {
    const ids = this.favoriteIds();
    if (ids.length === 0) return;
    await this.downloadZip(ids);
  }

  private async downloadZip(imageIds: string[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.downloading.set(true);
    try {
      const blob = await firstValueFrom(
        this.api.bulkDownload(this.slug, imageIds),
      );
      const url = URL.createObjectURL(blob);
      const safe = (this.event()?.title || 'gallery').replace(/[^A-Za-z0-9._-]+/g, '_');
      this.triggerDownload(url, `${safe}.zip`);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } finally {
      this.downloading.set(false);
    }
  }

  private triggerDownload(url: string, filename: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  private fail(message: string): void {
    this.errorMessage.set(message);
    this.state.set('error');
  }
}
