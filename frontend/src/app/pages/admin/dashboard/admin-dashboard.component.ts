import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { AdminStats, AvailabilityStatus, Booking, BookingStatus } from '../../../core/models/api.models';
import { AvailabilityCalendarComponent } from '../../booking/components/availability-calendar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AvailabilityCalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pt-32 pb-12">
      <div class="container-luxe px-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span class="eyebrow">Admin</span>
          <h1 class="mt-3 font-display text-4xl md:text-5xl text-white">Panou de <span class="gold-text">control</span></h1>
        </div>
        <button (click)="logout()" class="btn btn-ghost">Logout</button>
      </div>
    </section>

    <section class="pb-10">
      <div class="container-luxe px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="glass rounded-2xl p-6">
          <p class="eyebrow text-[10px]">Rezervări total</p>
          <p class="font-display text-4xl gold-text mt-2">{{ stats()?.bookings?.total ?? 0 }}</p>
        </div>
        <div class="glass rounded-2xl p-6">
          <p class="eyebrow text-[10px]">În așteptare</p>
          <p class="font-display text-4xl text-amber-300 mt-2">{{ stats()?.bookings?.pending ?? 0 }}</p>
        </div>
        <div class="glass rounded-2xl p-6">
          <p class="eyebrow text-[10px]">Confirmate</p>
          <p class="font-display text-4xl text-emerald-300 mt-2">{{ stats()?.bookings?.confirmed ?? 0 }}</p>
        </div>
        <div class="glass rounded-2xl p-6">
          <p class="eyebrow text-[10px]">Mesaje necitite</p>
          <p class="font-display text-4xl text-lake-300 mt-2">{{ stats()?.messages?.unread ?? 0 }}</p>
        </div>
      </div>
    </section>

    <section class="pb-20">
      <div class="container-luxe px-6 grid lg:grid-cols-3 gap-8">
        <!-- Bookings list -->
        <div class="lg:col-span-2 glass rounded-3xl p-7">
          <div class="flex items-center justify-between mb-5">
            <h2 class="font-display text-2xl text-white">Cereri rezervări</h2>
            <select [value]="filter()" (change)="onFilter($event)"
                    class="bg-ink-900/70 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/80 outline-none focus:border-gold-400">
              <option value="">Toate</option>
              <option value="pending">În așteptare</option>
              <option value="confirmed">Confirmate</option>
              <option value="rejected">Refuzate</option>
              <option value="cancelled">Anulate</option>
            </select>
          </div>

          <div class="space-y-3 max-h-[640px] overflow-y-auto pr-2">
            <article *ngFor="let b of bookings()" class="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-gold-400/30 transition">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p class="font-display text-xl text-white">{{ b.full_name }} <span class="text-white/40 text-sm">· {{ b.event_type }}</span></p>
                  <p class="text-xs text-white/55 mt-1">{{ b.email }} · {{ b.phone }}</p>
                </div>
                <span class="text-xs uppercase tracking-widest px-3 py-1 rounded-full"
                      [ngClass]="statusClass(b.status)">{{ b.status }}</span>
              </div>
              <div class="mt-3 flex flex-wrap gap-5 text-sm text-white/75">
                <span><span class="text-white/40">Data:</span> {{ b.event_date }}</span>
                <span><span class="text-white/40">Invitați:</span> {{ b.guests }}</span>
              </div>
              <p *ngIf="b.message" class="mt-3 text-sm text-white/65 italic">„{{ b.message }}”</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <button *ngIf="b.status !== 'confirmed'" (click)="setStatus(b, 'confirmed')" class="text-xs px-3 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-200 hover:bg-emerald-400/25 transition">Confirmă</button>
                <button *ngIf="b.status !== 'pending'" (click)="setStatus(b, 'pending')" class="text-xs px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-200 hover:bg-amber-400/25 transition">În așteptare</button>
                <button *ngIf="b.status !== 'rejected'" (click)="setStatus(b, 'rejected')" class="text-xs px-3 py-1.5 rounded-full bg-rose-400/15 border border-rose-400/30 text-rose-200 hover:bg-rose-400/25 transition">Refuză</button>
                <button (click)="remove(b)" class="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition">Șterge</button>
              </div>
            </article>
            <p *ngIf="!bookings().length" class="text-white/50 text-sm">Nu există cereri.</p>
          </div>
        </div>

        <!-- Calendar control -->
        <aside class="lg:col-span-1 space-y-5">
          <app-availability-calendar (dateSelected)="onPickDate($event)"></app-availability-calendar>

          <div class="glass rounded-2xl p-6" *ngIf="pickedDate()">
            <p class="eyebrow text-[10px] text-gold-300">Dată selectată</p>
            <p class="font-display text-2xl text-white mt-1">{{ pickedDate() }}</p>
            <div class="mt-4 grid grid-cols-2 gap-2">
              <button (click)="overrideStatus('blocked')" class="text-xs px-3 py-2 rounded-lg border border-white/10 hover:border-gold-400/40">Blochează</button>
              <button (click)="overrideStatus('booked')" class="text-xs px-3 py-2 rounded-lg border border-rose-400/30 text-rose-200 hover:bg-rose-400/10">Marchează rezervat</button>
              <button (click)="overrideStatus('pending')" class="text-xs px-3 py-2 rounded-lg border border-amber-400/30 text-amber-200 hover:bg-amber-400/10">În așteptare</button>
              <button (click)="overrideStatus('available')" class="text-xs px-3 py-2 rounded-lg border border-emerald-400/30 text-emerald-200 hover:bg-emerald-400/10">Eliberează</button>
            </div>
          </div>
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

  ngOnInit(): void { this.refresh(); }

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

  onPickDate(iso: string): void { this.pickedDate.set(iso); }

  overrideStatus(status: AvailabilityStatus): void {
    const day = this.pickedDate();
    if (!day) return;
    if (status === 'available') {
      this.bookingSvc.clearAvailability(day).subscribe(() => this.refresh());
    } else {
      this.bookingSvc.upsertAvailability(day, status).subscribe(() => this.refresh());
    }
  }

  statusClass(s: BookingStatus): string {
    return ({
      pending:   'bg-amber-400/15 text-amber-200 border border-amber-400/30',
      confirmed: 'bg-emerald-400/15 text-emerald-200 border border-emerald-400/30',
      rejected:  'bg-rose-400/15 text-rose-200 border border-rose-400/30',
      cancelled: 'bg-white/10 text-white/60 border border-white/15'
    } as Record<BookingStatus, string>)[s];
  }

  logout(): void { this.auth.logout(); this.router.navigateByUrl('/admin/login'); }
}
