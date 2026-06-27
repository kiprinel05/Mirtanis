import { Injectable, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Per-gallery image favorites stored in localStorage.
 * Keyed by event slug → set of image IDs.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly STORAGE_KEY = 'foto-bugeac-favorites';
  private readonly state = signal<Record<string, string[]>>({});

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) this.state.set(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }
  }

  forEvent(slug: string) {
    return computed(() => this.state()[slug] ?? []);
  }

  isFavorite(slug: string, imageId: string): boolean {
    return (this.state()[slug] ?? []).includes(imageId);
  }

  toggle(slug: string, imageId: string): void {
    const current = this.state()[slug] ?? [];
    const next = current.includes(imageId)
      ? current.filter((id) => id !== imageId)
      : [...current, imageId];
    this.state.update((s) => ({ ...s, [slug]: next }));
    this.persist();
  }

  clear(slug: string): void {
    this.state.update((s) => {
      const next = { ...s };
      delete next[slug];
      return next;
    });
    this.persist();
  }

  private persist(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state()));
    } catch {
      /* ignore */
    }
  }
}
