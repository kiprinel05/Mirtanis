import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AdminApiService } from '../../core/services/admin-api.service';
import {
  EventAdminOut,
  EventStatus,
  ImageAdminOut,
} from '../../shared/models/gallery.models';

@Component({
  selector: 'fb-admin-event',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <a routerLink="/admin" class="text-xs tracking-[0.2em] uppercase text-offwhite/60 hover-underline">
      ← Înapoi la evenimente
    </a>

    @if (loading()) {
      <p class="mt-10 text-offwhite/60">Se încarcă…</p>
    } @else {
      @if (event(); as e) {
      <div class="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="font-display text-4xl text-offwhite mb-1">{{ e.title }}</h1>
          @if (e.client_name) {
            <p class="text-offwhite/60">{{ e.client_name }}</p>
          }
        </div>
        <div class="flex flex-wrap gap-2">
          <button (click)="togglePublish()" class="btn-outline text-xs">
            @if (e.status === 'published') { Treci în ciornă } @else { Publică }
          </button>
          <button (click)="rotateLink()" class="btn-outline text-xs">🔄 Rotește link</button>
          <button (click)="deleteEvent()" class="px-5 py-2 rounded-full border border-red-500/40 text-red-400 text-xs tracking-[0.15em] uppercase hover:bg-red-500/10 transition-all">
            Șterge eveniment
          </button>
        </div>
      </div>

      <!-- Share link card -->
      <div class="glass-strong rounded-2xl p-6 mt-8">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-0">
            <div class="text-[10px] tracking-[0.3em] uppercase text-gold/80 mb-1">Link privat pentru client</div>
            <div class="font-mono text-sm text-offwhite/90 truncate" [title]="shareUrl(e.slug)">
              {{ shareUrl(e.slug) }}
            </div>
          </div>
          <button (click)="copyLink(e.slug)" class="btn-primary text-xs whitespace-nowrap">
            @if (copied()) { ✓ Copiat } @else { Copiază link }
          </button>
        </div>
        @if (e.has_password) {
          <p class="mt-3 text-xs text-gold/80">🔒 Galeria este protejată cu o parolă.</p>
        }
        @if (e.expires_at) {
          <p class="mt-1 text-xs text-offwhite/50">Expiră: {{ formatDate(e.expires_at) }}</p>
        }
      </div>

      <!-- Upload zone -->
      <div
        class="mt-8 glass rounded-2xl p-8 text-center transition-all"
        [class.border-gold]="dragOver()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <input
          #fileInput
          type="file"
          multiple
          accept="image/*"
          (change)="onFilePick(fileInput.files)"
          class="hidden"
        />
        <p class="font-display text-2xl text-offwhite mb-2">Încarcă fotografii</p>
        <p class="text-offwhite/60 text-sm mb-4">Trage fișierele aici sau apasă butonul.</p>
        <button (click)="fileInput.click()" class="btn-primary text-xs">Alege fișiere</button>

        @if (uploadProgress() !== null) {
          <div class="mt-6 max-w-md mx-auto">
            <div class="h-[3px] bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-gold to-gold-champagne transition-all"
                [style.width.%]="uploadProgress()"></div>
            </div>
            <p class="mt-2 text-xs text-offwhite/60">{{ uploadProgress() }}%</p>
          </div>
        }

        @if (uploadErrors().length > 0) {
          <ul class="mt-4 text-xs text-red-400 text-left max-w-md mx-auto space-y-1">
            @for (msg of uploadErrors(); track msg) {
              <li>· {{ msg }}</li>
            }
          </ul>
        }
      </div>

      <!-- Images grid -->
      <div class="mt-10">
        <div class="flex items-center justify-between mb-5">
          <h2 class="font-display text-2xl text-offwhite">Fotografii</h2>
          <span class="text-xs tracking-[0.25em] uppercase text-offwhite/50">
            {{ images().length }} cadre
          </span>
        </div>

        @if (images().length === 0) {
          <p class="text-offwhite/40 text-sm">Niciun cadru încă.</p>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            @for (img of imagesWithPreview(); track img.id) {
              <figure class="group relative aspect-square rounded-xl overflow-hidden glass">
                <img [src]="img.preview" [alt]="img.filename"
                  loading="lazy"
                  class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button (click)="setCover(img.id)" class="px-3 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase bg-gold text-primary">
                    Setează copertă
                  </button>
                  <button (click)="remove(img.id)" class="px-3 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase border border-red-400 text-red-300">
                    Șterge
                  </button>
                </div>
                <figcaption class="absolute bottom-0 inset-x-0 px-2 py-1 bg-black/60 text-[10px] text-offwhite/80 truncate">
                  {{ img.filename }}
                </figcaption>
              </figure>
            }
          </div>
        }
      </div>
      }
    }
  `,
})
export class AdminEventComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly event = signal<EventAdminOut | null>(null);
  protected readonly images = signal<ImageAdminOut[]>([]);
  protected readonly loading = signal(true);
  protected readonly dragOver = signal(false);
  protected readonly uploadProgress = signal<number | null>(null);
  protected readonly uploadErrors = signal<string[]>([]);
  protected readonly copied = signal(false);

  private eventId = '';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') ?? '';
    void this.refresh();
  }

  private async refresh(): Promise<void> {
    this.loading.set(true);
    try {
      const [e, imgs] = await Promise.all([
        firstValueFrom(this.api.getEvent(this.eventId)),
        firstValueFrom(this.api.listImages(this.eventId)),
      ]);
      this.event.set(e);
      this.images.set(imgs);
    } finally {
      this.loading.set(false);
    }
  }

  protected imagesWithPreview(): Array<ImageAdminOut & { preview: string }> {
    return this.images().map((img) => ({
      ...img,
      preview: img.thumb_url || img.preview_url || '',
    }));
  }

  protected shareUrl(slug: string): string {
    if (!isPlatformBrowser(this.platformId)) return `/gallery/${slug}`;
    return `${window.location.origin}/gallery/${slug}`;
  }

  protected async copyLink(slug: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      await navigator.clipboard.writeText(this.shareUrl(slug));
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    } catch {
      /* ignore */
    }
  }

  // ---- Upload ----
  protected onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(true);
  }
  protected onDragLeave(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(false);
  }
  protected onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(false);
    if (!e.dataTransfer?.files) return;
    void this.upload(Array.from(e.dataTransfer.files));
  }
  protected onFilePick(files: FileList | null): void {
    if (!files) return;
    void this.upload(Array.from(files));
  }

  private async upload(files: File[]): Promise<void> {
    const imgs = files.filter((f) => f.type.startsWith('image/'));
    if (imgs.length === 0) return;

    this.uploadErrors.set([]);
    this.uploadProgress.set(0);

    // Naive progress simulation — HttpClient doesn't expose stream progress
    // without `reportProgress`. We start at 5% and bump to 95% on submit.
    this.uploadProgress.set(5);
    try {
      const res = await firstValueFrom(
        this.api.uploadImages(this.eventId, imgs),
      );
      this.uploadProgress.set(100);
      if (res.failed.length) this.uploadErrors.set(res.failed);
      await this.refresh();
    } catch (err: unknown) {
      const e = err as { error?: { detail?: string } };
      this.uploadErrors.set([e?.error?.detail || 'Încărcarea a eșuat.']);
    } finally {
      setTimeout(() => this.uploadProgress.set(null), 1200);
    }
  }

  protected async setCover(imageId: string): Promise<void> {
    const updated = await firstValueFrom(
      this.api.setCover(this.eventId, imageId),
    );
    this.event.set(updated);
  }

  protected async remove(imageId: string): Promise<void> {
    if (!confirm('Sigur ștergi această fotografie?')) return;
    await firstValueFrom(this.api.deleteImage(this.eventId, imageId));
    this.images.update((list) => list.filter((i) => i.id !== imageId));
  }

  protected async togglePublish(): Promise<void> {
    const e = this.event();
    if (!e) return;
    const next: EventStatus = e.status === 'published' ? 'draft' : 'published';
    const updated = await firstValueFrom(
      this.api.updateEvent(this.eventId, { status: next }),
    );
    this.event.set(updated);
  }

  protected async rotateLink(): Promise<void> {
    if (!confirm('Rotirea link-ului va dezactiva instant link-ul vechi. Continui?')) return;
    const updated = await firstValueFrom(this.api.rotateLink(this.eventId));
    this.event.set(updated);
  }

  protected async deleteEvent(): Promise<void> {
    if (!confirm('Această acțiune șterge definitiv evenimentul și toate fotografiile. Continui?')) return;
    await firstValueFrom(this.api.deleteEvent(this.eventId));
    this.router.navigate(['/admin']);
  }

  protected formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString('ro-RO', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch {
      return iso;
    }
  }
}
