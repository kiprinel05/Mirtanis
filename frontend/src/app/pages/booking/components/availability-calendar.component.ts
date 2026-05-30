import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { AvailabilityStatus, DayStatus } from '../../../core/models/api.models';

interface Cell {
  date: Date;
  iso: string;
  inMonth: boolean;
  isPast: boolean;
  status: AvailabilityStatus;
  selected: boolean;
}

const RO_MONTHS = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
const RO_DAYS = ['Lu','Ma','Mi','Jo','Vi','Sâ','Du'];

@Component({
  selector: 'app-availability-calendar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass rounded-3xl p-6 md:p-8">
      <header class="flex items-center justify-between mb-6">
        <button (click)="prev()" class="w-11 h-11 rounded-full border border-white/10 hover:border-gold-400/60 hover:bg-gold-400/5 transition flex items-center justify-center" aria-label="Luna anterioară">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
        <h3 class="font-display text-2xl md:text-3xl text-white">{{ monthLabel() }}</h3>
        <button (click)="next()" class="w-11 h-11 rounded-full border border-white/10 hover:border-gold-400/60 hover:bg-gold-400/5 transition flex items-center justify-center" aria-label="Luna următoare">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      </header>

      <div class="grid grid-cols-7 gap-1 text-center text-[10px] tracking-widest uppercase text-white/40 mb-3">
        <span *ngFor="let d of days">{{ d }}</span>
      </div>

      <div class="grid grid-cols-7 gap-1.5">
        <button *ngFor="let c of cells()" (click)="select(c)"
                [disabled]="!c.inMonth || c.isPast || c.status === 'booked' || c.status === 'blocked'"
                [attr.title]="cellTitle(c)"
                class="relative aspect-square rounded-xl text-sm flex flex-col items-center justify-center transition-all duration-300"
                [ngClass]="cellClasses(c)">
          <span>{{ c.inMonth ? c.date.getDate() : '' }}</span>
          <span *ngIf="c.inMonth && c.status !== 'available'"
                class="absolute bottom-1.5 w-1.5 h-1.5 rounded-full"
                [ngClass]="dotColor(c.status)"></span>
        </button>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/70">
        <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>Disponibil</span>
        <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-amber-400/80"></span>În așteptare</span>
        <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-rose-400/80"></span>Rezervat</span>
        <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-white/40"></span>Blocat</span>
      </div>
    </div>
  `
})
export class AvailabilityCalendarComponent implements OnInit {
  private readonly bookings = inject(BookingService);

  @Output() readonly dateSelected = new EventEmitter<string>();

  readonly days = RO_DAYS;
  readonly cursor = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  readonly selected = signal<string | null>(null);
  readonly statuses = signal<Record<string, DayStatus>>({});

  readonly monthLabel = () => `${RO_MONTHS[this.cursor().getMonth()]} ${this.cursor().getFullYear()}`;

  readonly cells = (): Cell[] => {
    const c = this.cursor();
    const year = c.getFullYear(), month = c.getMonth();
    const first = new Date(year, month, 1);
    const startWeekday = (first.getDay() + 6) % 7; // monday=0
    const totalDays = new Date(year, month + 1, 0).getDate();

    const result: Cell[] = [];
    const today = new Date(); today.setHours(0,0,0,0);
    const sel = this.selected();
    const map = this.statuses();

    for (let i = 0; i < startWeekday; i++) {
      const d = new Date(year, month, i - startWeekday + 1);
      result.push({ date: d, iso: '', inMonth: false, isPast: true, status: 'available', selected: false });
    }
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day);
      const iso = this.toIso(d);
      const status = map[iso]?.status ?? 'available';
      result.push({
        date: d, iso, inMonth: true,
        isPast: d < today,
        status,
        selected: sel === iso
      });
    }
    while (result.length % 7 !== 0) {
      const last = result[result.length - 1].date;
      const d = new Date(last); d.setDate(last.getDate() + 1);
      result.push({ date: d, iso: '', inMonth: false, isPast: true, status: 'available', selected: false });
    }
    return result;
  };

  ngOnInit(): void { this.loadMonth(); }

  prev(): void {
    const c = this.cursor();
    this.cursor.set(new Date(c.getFullYear(), c.getMonth() - 1, 1));
    this.loadMonth();
  }

  next(): void {
    const c = this.cursor();
    this.cursor.set(new Date(c.getFullYear(), c.getMonth() + 1, 1));
    this.loadMonth();
  }

  select(c: Cell): void {
    if (!c.inMonth || c.isPast || c.status === 'booked' || c.status === 'blocked') return;
    this.selected.set(c.iso);
    this.dateSelected.emit(c.iso);
  }

  cellClasses(c: Cell): Record<string, boolean> {
    const enabled = c.inMonth && !c.isPast && c.status !== 'booked' && c.status !== 'blocked';
    return {
      'opacity-30 cursor-default': !c.inMonth || c.isPast,
      'bg-white/[0.03] text-white/80 hover:bg-gold-400/10 hover:text-white border border-white/5': enabled && !c.selected && c.status === 'available',
      'bg-amber-400/15 text-amber-100 border border-amber-400/30': enabled && !c.selected && c.status === 'pending',
      'bg-rose-500/15 text-rose-200 border border-rose-500/30 cursor-not-allowed': c.status === 'booked' && c.inMonth,
      'bg-white/5 text-white/40 border border-white/10 cursor-not-allowed': c.status === 'blocked' && c.inMonth,
      'bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 font-semibold shadow-glow-gold scale-[1.03]': c.selected
    };
  }

  dotColor(status: AvailabilityStatus): string {
    switch (status) {
      case 'available': return 'bg-emerald-400/80';
      case 'pending':   return 'bg-amber-400/80';
      case 'booked':    return 'bg-rose-400/80';
      case 'blocked':   return 'bg-white/40';
    }
  }

  cellTitle(c: Cell): string {
    if (!c.inMonth) return '';
    if (c.isPast) return 'Dată trecută';
    return `${c.iso} — ${c.status}`;
  }

  private toIso(d: Date): string {
    const y = d.getFullYear(); const m = String(d.getMonth()+1).padStart(2,'0'); const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }

  private loadMonth(): void {
    const c = this.cursor();
    const year = c.getFullYear(), month = c.getMonth();
    const start = this.toIso(new Date(year, month, 1));
    const end = this.toIso(new Date(year, month + 1, 0));
    this.bookings.getCalendar(start, end).subscribe({
      next: (range) => {
        const map: Record<string, DayStatus> = {};
        for (const d of range.days) map[d.day] = d;
        this.statuses.set(map);
      },
      error: () => this.statuses.set({})
    });
  }
}
