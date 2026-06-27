import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface BookingPayload {
  name: string;
  email: string;
  phone?: string | null;
  service: 'wedding' | 'baptism' | 'event' | 'studio' | 'fashion' | 'other';
  message: string;
  preferred_date?: string | null;
}

export interface BookingResponse {
  ok: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  send(payload: BookingPayload): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.base}/booking`, payload);
  }
}
