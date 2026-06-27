import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  GalleryImageOut,
  GalleryUnlockResponse,
  PublicEventOut,
} from '../../shared/models/gallery.models';

@Injectable({ providedIn: 'root' })
export class GalleryApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  /** Token granted by `unlock()` when the gallery is password-protected. */
  private galleryToken: string | null = null;

  private headers(): HttpHeaders {
    return new HttpHeaders(
      this.galleryToken ? { Authorization: `Bearer ${this.galleryToken}` } : {},
    );
  }

  setGalleryToken(token: string | null): void {
    this.galleryToken = token;
  }

  getEvent(slug: string): Observable<PublicEventOut> {
    return this.http.get<PublicEventOut>(`${this.base}/gallery/${slug}`);
  }

  unlock(slug: string, password: string): Observable<GalleryUnlockResponse> {
    return this.http.post<GalleryUnlockResponse>(
      `${this.base}/gallery/${slug}/unlock`,
      { password },
    );
  }

  listImages(slug: string): Observable<GalleryImageOut[]> {
    return this.http.get<GalleryImageOut[]>(
      `${this.base}/gallery/${slug}/images`,
      { headers: this.headers() },
    );
  }

  downloadSingle(
    slug: string,
    imageId: string,
  ): Observable<{ url: string; filename: string }> {
    return this.http.get<{ url: string; filename: string }>(
      `${this.base}/gallery/${slug}/images/${imageId}/download`,
      { headers: this.headers() },
    );
  }

  bulkDownloadUrl(slug: string): string {
    return `${this.base}/gallery/${slug}/download`;
  }

  bulkDownload(
    slug: string,
    imageIds: string[],
  ): Observable<Blob> {
    return this.http.post(
      `${this.base}/gallery/${slug}/download`,
      { image_ids: imageIds },
      {
        headers: this.headers(),
        responseType: 'blob',
      },
    );
  }
}
