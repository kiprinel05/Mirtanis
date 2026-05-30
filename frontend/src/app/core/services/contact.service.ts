import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  send(payload: ContactRequest): Observable<unknown> {
    return this.http.post(`${this.base}/contact`, payload);
  }

  list(): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${this.base}/contact`);
  }

  markRead(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/contact/${id}/read`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/contact/${id}`);
  }
}
