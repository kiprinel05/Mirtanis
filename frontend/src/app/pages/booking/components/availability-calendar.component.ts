import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { DayStatus } from '../../../core/models/api.models';

type Cell = { date: Date; inMonth: boolean; iso: string; status?: string; isPast: boolean; isToday: boolean };

@Component({
  selector: 'app-availability-calendar',
  standalone: true,
  template: `
    <div class="select-none">
      <div class="mb-5 flex items-center justify-between">
        <button type="button" (click)="prev()"
                class="grid h-10 w-10 place-items-center rounded-full border border-cream-400 text-ink-700 transition hover:border-gold-400 hover:text-gold-600"
                aria-label="Luna anterioară"><span class="mi text-[22px]">chevron_left</span></button>
        <p class="font-display text-2xl capitalize text-ink-900">{{ label }}</p>
        <button type="button" (click)="next()"
                class="grid h-10 w-10 place-items-center rounded-full border border-cream-400 text-ink-700 transition hover:border-gold-400 hover:text-gold-600"
                aria-label="Luna următoare"><span class="mi text-[22px]">chevron_right</span></button>
      </div>

      <div class="mb-2 grid grid-cols-7 gap-1.5 text-center text-[11px] uppercase tracking-wider text-ink-400">
        @for (d of weekdays; track d) { <span>{{ d }}</span> }
      </div>

      <div class="grid grid-cols-7 gap-1.5">
        @for (c of cells(); track c.iso) {
          <button type="button"
                  [disabled]="disabled(c)"
                  (click)="pick(c)"
                  class="relative grid aspect-square place-items-center rounded-xl text-sm transition"
                  [class.ring-2]="selected === c.iso"
                  [class.ring-gold-500]="selected === c.iso"
                  [class]="cellClass(c)">
            {{ c.date.getDate() }}
            @if (c.isToday) { <span class="absolute bottom-1 h-1 w-1 rounded-full bg-current"></span> }
          </button>
        }
      </div>

      <div class="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-ink-500">
        <span class="flex items-center gap-1.5"><i class="h-2.5 w-2.5 rounded-full bg-sage-300"></i>liber</span>
        <span class="flex items-center gap-1.5"><i class="h-2.5 w-2.5 rounded-full bg-gold-300"></i>în așteptare</span>
        <span class="flex items-center gap-1.5"><i class="h-2.5 w-2.5 rounded-full bg-blush-300"></i>rezervat</span>
        <span class="flex items-center gap-1.5"><i class="h-2.5 w-2.5 rounded-full bg-cream-400"></i>indisponibil</span>
      </div>
    </div>
  `
})
export class AvailabilityCalendarComponent implements OnChanges {
  @Input() days: DayStatus[] = [];
  @Input() selected: string | null = null;
  /** In admin mode every (non-past) day is clickable, including booked/blocked. */
  @Input() adminMode = false;
  @Output() daySelected = new EventEmitter<string>();
  @Output() monthChanged = new EventEmitter<{ start: string; end: string }>();

  readonly weekdays = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];
  readonly cells = signal<Cell[]>([]);
  private cursor = new Date();
  label = '';
  private statusMap = new Map<string, string>();

  ngOnChanges(): void {
    this.statusMap.clear();
    for (const d of this.days) this.statusMap.set(d.day, d.status);
    this.build();
  }

  prev(): void { this.cursor = new Date(this.cursor.getFullYear(), this.cursor.getMonth() - 1, 1); this.build(); this.emitMonth(); }
  next(): void { this.cursor = new Date(this.cursor.getFullYear(), this.cursor.getMonth() + 1, 1); this.build(); this.emitMonth(); }

  private build(): void {
    const year = this.cursor.getFullYear();
    const month = this.cursor.getMonth();
    this.label = this.cursor.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7;
    const start = new Date(year, month, 1 - startOffset);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayIso = this.toIso(today);
    const cells: Cell[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = this.toIso(d);
      cells.push({
        date: d,
        inMonth: d.getMonth() === month,
        iso,
        status: this.statusMap.get(iso),
        isPast: d < today,
        isToday: iso === todayIso
      });
    }
    this.cells.set(cells);
  }

  private emitMonth(): void {
    const y = this.cursor.getFullYear();
    const m = this.cursor.getMonth();
    const start = this.toIso(new Date(y, m, 1));
    const end = this.toIso(new Date(y, m + 1, 0));
    this.monthChanged.emit({ start, end });
  }

  private toIso(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  disabled(c: Cell): boolean {
    if (!c.inMonth || c.isPast) return true;
    // Admins may click any day (to release/override it); guests can't pick taken days.
    if (this.adminMode) return false;
    return c.status === 'booked' || c.status === 'blocked';
  }

  pick(c: Cell): void {
    if (this.disabled(c)) return;
    this.daySelected.emit(c.iso);
  }

  cellClass(c: Cell): string {
    if (!c.inMonth) return 'text-transparent pointer-events-none';
    if (c.isPast) return 'text-ink-400/50 cursor-not-allowed';
    const taken = c.status === 'booked' || c.status === 'blocked';
    const cursor = (taken && !this.adminMode) ? 'cursor-not-allowed' : 'cursor-pointer';
    switch (c.status) {
      case 'booked':  return `bg-blush-100 text-blush-400 ${cursor}`;
      case 'pending': return `bg-gold-100 text-gold-700 ${cursor}`;
      case 'blocked': return `bg-cream-300 text-ink-500 ${cursor}`;
      default:        return 'bg-sage-50 text-sage-600 hover:bg-gold-400 hover:text-cream-50';
    }
  }
}
