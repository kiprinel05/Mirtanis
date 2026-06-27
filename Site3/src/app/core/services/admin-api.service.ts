import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AdminAuthService } from './admin-auth.service';
import {
  BulkUploadResult,
  EventAdminOut,
  EventCreatePayload,
  EventListOut,
  EventUpdatePayload,
  ImageAdminOut,
} from '../../shared/models/gallery.models';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AdminAuthService);
  private readonly base = environment.apiBaseUrl;

  private authHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders(
      token ? { Authorization: `Bearer ${token}` } : {},
    );
  }

  listEvents(limit = 50, offset = 0): Observable<EventListOut> {
    return this.http.get<EventListOut>(`${this.base}/events`, {
      headers: this.authHeaders(),
      params: { limit, offset },
    });
  }

  createEvent(payload: EventCreatePayload): Observable<EventAdminOut> {
    return this.http.post<EventAdminOut>(`${this.base}/events`, payload, {
      headers: this.authHeaders(),
    });
  }

  getEvent(eventId: string): Observable<EventAdminOut> {
    return this.http.get<EventAdminOut>(`${this.base}/events/${eventId}`, {
      headers: this.authHeaders(),
    });
  }

  updateEvent(
    eventId: string,
    payload: EventUpdatePayload,
  ): Observable<EventAdminOut> {
    return this.http.patch<EventAdminOut>(
      `${this.base}/events/${eventId}`,
      payload,
      { headers: this.authHeaders() },
    );
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/events/${eventId}`, {
      headers: this.authHeaders(),
    });
  }

  rotateLink(eventId: string): Observable<EventAdminOut> {
    return this.http.post<EventAdminOut>(
      `${this.base}/events/${eventId}/rotate-link`,
      {},
      { headers: this.authHeaders() },
    );
  }

  listImages(eventId: string): Observable<ImageAdminOut[]> {
    return this.http.get<ImageAdminOut[]>(
      `${this.base}/events/${eventId}/images`,
      { headers: this.authHeaders() },
    );
  }

  uploadImages(
    eventId: string,
    files: File[],
  ): Observable<BulkUploadResult> {
    const form = new FormData();
    for (const f of files) form.append('files', f, f.name);
    return this.http.post<BulkUploadResult>(
      `${this.base}/events/${eventId}/images`,
      form,
      { headers: this.authHeaders() },
    );
  }

  deleteImage(eventId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/events/${eventId}/images/${imageId}`,
      { headers: this.authHeaders() },
    );
  }

  setCover(eventId: string, imageId: string): Observable<EventAdminOut> {
    return this.http.post<EventAdminOut>(
      `${this.base}/events/${eventId}/images/${imageId}/cover`,
      {},
      { headers: this.authHeaders() },
    );
  }
}
