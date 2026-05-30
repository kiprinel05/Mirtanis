import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GalleryCategory, GalleryImage } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  list(category?: GalleryCategory): Observable<GalleryImage[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    return this.http.get<GalleryImage[]>(`${this.base}/gallery`, { params });
  }

  resolveUrl(url: string): string {
    if (!url) return '';
    if (/^https?:/.test(url)) return url;
    return `${environment.uploadsUrl}${url}`;
  }
}
