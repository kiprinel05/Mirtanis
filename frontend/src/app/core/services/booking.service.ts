import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Booking,
  BookingRequest,
  BookingStatus,
  CalendarRange,
  DayStatus,
  AvailabilityStatus,
  Venue
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  createBooking(payload: BookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.base}/bookings`, payload);
  }

  listBookings(status?: BookingStatus): Observable<Booking[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Booking[]>(`${this.base}/bookings`, { params });
  }

  updateBooking(id: number, patch: { status?: BookingStatus; venue?: Venue; message?: string }): Observable<Booking> {
    return this.http.patch<Booking>(`${this.base}/bookings/${id}`, patch);
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/bookings/${id}`);
  }

  getCalendar(start: string, end: string): Observable<CalendarRange> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<CalendarRange>(`${this.base}/calendar`, { params });
  }

  upsertAvailability(day: string, status: AvailabilityStatus, note?: string | null): Observable<DayStatus> {
    return this.http.post<DayStatus>(`${this.base}/calendar/availability`, { day, status, note });
  }

  clearAvailability(day: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.base}/calendar/availability/${day}`);
  }
}
