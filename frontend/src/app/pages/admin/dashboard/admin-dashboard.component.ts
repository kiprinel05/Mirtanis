import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { AdminStats, AvailabilityStatus, Booking, BookingStatus, DayStatus } from '../../../core/models/api.models';
import { AvailabilityCalendarComponent } from '../../booking/components/availability-calendar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AvailabilityCalendarComponent],
  template: `
    <section class="container-x pb-16 pt-28 sm:pt-32">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="eyebrow">Administrare</p>
          <h1 class="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">Panou de <span class="gold-text">control</span></h1>
        </div>
        <button (click)="logout()" class="btn btn-outline">Deconectare</button>
      </div>

      <!-- Stats -->
      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        @for (s of statCards(); track s.label) {
          <div class="card p-6">
            <p class="text-xs uppercase tracking-widest2 text-ink-500">{{ s.label }}</p>
            <p class="mt-2 font-display text-4xl" [class]="s.color">{{ s.value }}</p>
          </div>
        }
      </div>

      <div class="mt-10 grid gap-8 lg:grid-cols-3">
        <!-- Bookings -->
        <div class="card p-6 sm:p-7 lg:col-span-2">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="font-display text-2xl text-ink-900">Cereri rezervări</h2>
            <select [value]="filter()" (change)="onFilter($event)"
                    class="rounded-xl border border-cream-400 bg-cream-50 px-3 py-2 text-sm text-ink-700 outline-none focus:border-gold-400">
              <option value="">Toate</option>
              <option value="pending">În așteptare</option>
              <option value="confirmed">Confirmate</option>
              <option value="rejected">Refuzate</option>
              <option value="cancelled">Anulate</option>
            </select>
          </div>

          <div class="max-h-[640px] space-y-3 overflow-y-auto pr-1">
            @for (b of bookings(); track b.id) {
              <article class="rounded-2xl border border-cream-300 bg-cream-100 p-5 transition hover:border-gold-300">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p class="font-display text-xl text-ink-900">{{ b.full_name }}
                      <span class="text-sm text-ink-400">· {{ b.event_type }}</span></p>
                    <p class="mt-1 text-xs text-ink-500">{{ b.email }} · {{ b.phone }}</p>
                  </div>
                  <span class="rounded-full px-3 py-1 text-xs uppercase tracking-wider" [class]="statusClass(b.status)">{{ b.status }}</span>
                </div>
                <div class="mt-3 flex flex-wrap gap-5 text-sm text-ink-600">
                  <span><span class="text-ink-400">Data:</span> {{ b.event_date }}</span>
                  <span><span class="text-ink-400">Invitați:</span> {{ b.guests }}</span>
                </div>
                @if (b.message) { <p class="mt-3 text-sm italic text-ink-500">„{{ b.message }}”</p> }
                <div class="mt-4 flex flex-wrap gap-2">
                  @if (b.status !== 'confirmed') {
                    <button (click)="setStatus(b, 'confirmed')" class="rounded-full bg-sage-100 px-3 py-1.5 text-xs text-sage-600 transition hover:bg-sage-200">Confirmă</button>
                  }
                  @if (b.status !== 'pending') {
                    <button (click)="setStatus(b, 'pending')" class="rounded-full bg-gold-100 px-3 py-1.5 text-xs text-gold-700 transition hover:bg-gold-200">În așteptare</button>
                  }
                  @if (b.status !== 'rejected') {
                    <button (click)="setStatus(b, 'rejected')" class="rounded-full bg-blush-100 px-3 py-1.5 text-xs text-blush-400 transition hover:bg-blush-200">Refuză</button>
                  }
                  <button (click)="remove(b)" class="rounded-full border border-cream-400 px-3 py-1.5 text-xs text-ink-500 transition hover:border-ink-400 hover:text-ink-700">Șterge</button>
                </div>
              </article>
            }
            @if (!bookings().length) { <p class="py-6 text-center text-sm text-ink-500">Nu există cereri.</p> }
          </div>
        </div>

        <!-- Calendar control -->
        <aside class="space-y-5">
          <div class="card p-6">
            <h2 class="mb-4 font-display text-2xl text-ink-900">Calendar</h2>
            <app-availability-calendar
              [days]="days()"
              [selected]="pickedDate()"
              (daySelected)="pickedDate.set($event)"
              (monthChanged)="loadMonth($event)" />
          </div>

          @if (pickedDate()) {
            <div class="card p-6">
              <p class="text-xs uppercase tracking-widest2 text-gold-600">Dată selectată</p>
              <p class="mt-1 font-display text-2xl text-ink-900">{{ pickedDate() }}</p>
              <div class="mt-4 grid grid-cols-2 gap-2">
                <button (click)="overrideStatus('available')" class="rounded-lg border border-sage-200 px-3 py-2 text-xs text-sage-600 hover:bg-sage-50">Eliberează</button>
                <button (click)="overrideStatus('pending')" class="rounded-lg border border-gold-200 px-3 py-2 text-xs text-gold-700 hover:bg-gold-50">În așteptare</button>
                <button (click)="overrideStatus('booked')" class="rounded-lg border border-blush-200 px-3 py-2 text-xs text-blush-400 hover:bg-blush-50">Rezervat</button>
                <button (click)="overrideStatus('blocked')" class="rounded-lg border border-cream-400 px-3 py-2 text-xs text-ink-600 hover:bg-cream-200">Blochează</button>
              </div>
            </div>
          }
        </aside>
      </div>
    </section>
  `
})
export class AdminDashboardComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly bookingSvc = inject(BookingService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly stats = signal<AdminStats | null>(null);
  readonly bookings = signal<Booking[]>([]);
  readonly filter = signal<BookingStatus | ''>('');
  readonly pickedDate = signal<string | null>(null);
  readonly days = signal<DayStatus[]>([]);
  private currentRange = this.monthRange(new Date());

  readonly statCards = () => {
    const s = this.stats();
    return [
      { label: 'Rezervări total', value: s?.bookings.total ?? 0, color: 'gold-text' },
      { label: 'În așteptare', value: s?.bookings.pending ?? 0, color: 'text-gold-600' },
      { label: 'Confirmate', value: s?.bookings.confirmed ?? 0, color: 'text-sage-500' },
      { label: 'Mesaje necitite', value: s?.messages.unread ?? 0, color: 'text-lake-400' }
    ];
  };

  ngOnInit(): void {
    this.refresh();
    this.loadMonth(this.currentRange);
  }

  refresh(): void {
    this.admin.getStats().subscribe({ next: (s) => this.stats.set(s), error: () => {} });
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingSvc.listBookings(this.filter() || undefined).subscribe({
      next: (rows) => this.bookings.set(rows),
      error: () => this.bookings.set([])
    });
  }

  loadMonth(range: { start: string; end: string }): void {
    this.currentRange = range;
    this.bookingSvc.getCalendar(range.start, range.end).subscribe({
      next: (res) => this.days.set(res.days),
      error: () => this.days.set([])
    });
  }

  onFilter(e: Event): void {
    this.filter.set((e.target as HTMLSelectElement).value as BookingStatus | '');
    this.loadBookings();
  }

  setStatus(b: Booking, status: BookingStatus): void {
    this.bookingSvc.updateBooking(b.id, { status }).subscribe(() => this.refresh());
  }

  remove(b: Booking): void {
    if (!confirm(`Ștergi cererea lui ${b.full_name}?`)) return;
    this.bookingSvc.deleteBooking(b.id).subscribe(() => this.refresh());
  }

  overrideStatus(status: AvailabilityStatus): void {
    const day = this.pickedDate();
    if (!day) return;
    const done = () => { this.refresh(); this.loadMonth(this.currentRange); };
    if (status === 'available') {
      this.bookingSvc.clearAvailability(day).subscribe(done);
    } else {
      this.bookingSvc.upsertAvailability(day, status).subscribe(done);
    }
  }

  statusClass(s: BookingStatus): string {
    return ({
      pending:   'bg-gold-100 text-gold-700',
      confirmed: 'bg-sage-100 text-sage-600',
      rejected:  'bg-blush-100 text-blush-400',
      cancelled: 'bg-cream-300 text-ink-500'
    } as Record<BookingStatus, string>)[s];
  }

  private monthRange(d: Date): { start: string; end: string } {
    const iso = (x: Date) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
    return { start: iso(new Date(d.getFullYear(), d.getMonth(), 1)), end: iso(new Date(d.getFullYear(), d.getMonth() + 1, 0)) };
  }

  logout(): void { this.auth.logout(); this.router.navigateByUrl('/admin/login'); }
}
