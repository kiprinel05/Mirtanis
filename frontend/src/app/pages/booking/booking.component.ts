import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvailabilityCalendarComponent } from './components/availability-calendar.component';
import { BookingService } from '../../core/services/booking.service';
import { EventType } from '../../core/models/api.models';
import { RevealDirective } from '../../shared/directives/reveal.directive';

interface EventOption { id: EventType; label: string; }

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AvailabilityCalendarComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pt-40 pb-16">
      <div class="container-luxe px-6 max-w-5xl">
        <span class="eyebrow">Rezervări</span>
        <h1 class="mt-4 font-display text-5xl md:text-7xl text-white">Verifică <span class="gold-text">disponibilitatea</span>.</h1>
        <p class="mt-6 text-white/70 max-w-2xl text-lg">Alege o dată din calendar și completează formularul în 3 pași. Te contactăm în maximum 24 de ore pentru confirmare.</p>
      </div>
    </section>

    <section class="pb-32">
      <div class="container-luxe px-6 grid lg:grid-cols-2 gap-10">
        <!-- Calendar -->
        <div appReveal>
          <app-availability-calendar (dateSelected)="onDate($event)"></app-availability-calendar>

          <div *ngIf="selectedDate()" class="mt-5 glass rounded-2xl px-5 py-4 flex items-center justify-between">
            <div>
              <p class="eyebrow text-[10px] text-gold-300">Dată selectată</p>
              <p class="font-display text-xl text-white">{{ selectedDate() | date:'fullDate':undefined:'ro-RO' }}</p>
            </div>
            <span class="text-emerald-300 text-sm flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>Disponibil
            </span>
          </div>
        </div>

        <!-- Multi-step form -->
        <div appReveal [revealDelay]="150" class="glass rounded-3xl p-7 md:p-9">
          <!-- Progress -->
          <div class="flex items-center gap-3 mb-8">
            <ng-container *ngFor="let s of [1,2,3]; let i = index">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm border transition-all duration-500"
                     [ngClass]="s <= step() ? 'bg-gold-400 text-ink-950 border-gold-400' : 'bg-transparent text-white/60 border-white/15'">
                  {{ s }}
                </div>
                <span class="text-xs tracking-widest uppercase"
                      [ngClass]="s === step() ? 'text-white' : 'text-white/40'">{{ stepLabel(s) }}</span>
              </div>
              <span *ngIf="i < 2" class="flex-1 h-px bg-white/10"></span>
            </ng-container>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <!-- STEP 1 -->
            <div *ngIf="step() === 1" class="space-y-5 animate-[routeIn_.5s_ease]">
              <div>
                <label class="eyebrow text-[10px]">Tip eveniment</label>
                <div class="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button *ngFor="let o of events" type="button" (click)="form.patchValue({event_type: o.id})"
                          class="px-3 py-3 rounded-xl border text-sm transition-all duration-300"
                          [ngClass]="form.value.event_type === o.id ? 'bg-gold-400/15 border-gold-400 text-white' : 'border-white/10 text-white/75 hover:border-gold-400/40'">
                    {{ o.label }}
                  </button>
                </div>
              </div>
              <div>
                <label class="eyebrow text-[10px]">Număr invitați</label>
                <input type="number" min="1" max="2000" formControlName="guests" class="input"/>
              </div>
              <div>
                <label class="eyebrow text-[10px]">Dată dorită</label>
                <input type="date" formControlName="event_date" class="input"/>
                <p class="text-xs text-white/45 mt-1">Tip: poți selecta și direct din calendar.</p>
              </div>
            </div>

            <!-- STEP 2 -->
            <div *ngIf="step() === 2" class="space-y-5 animate-[routeIn_.5s_ease]">
              <div>
                <label class="eyebrow text-[10px]">Nume complet</label>
                <input type="text" formControlName="full_name" class="input" placeholder="Andreea Popescu"/>
              </div>
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="eyebrow text-[10px]">Telefon</label>
                  <input type="tel" formControlName="phone" class="input" placeholder="+40 7..."/>
                </div>
                <div>
                  <label class="eyebrow text-[10px]">Email</label>
                  <input type="email" formControlName="email" class="input" placeholder="nume&#64;mail.com"/>
                </div>
              </div>
            </div>

            <!-- STEP 3 -->
            <div *ngIf="step() === 3" class="space-y-5 animate-[routeIn_.5s_ease]">
              <div>
                <label class="eyebrow text-[10px]">Mesaj (opțional)</label>
                <textarea rows="5" formControlName="message" class="input" placeholder="Spune-ne mai multe despre eveniment, viziune, detalii..."></textarea>
              </div>
              <div class="rounded-2xl border border-white/10 p-5 text-sm text-white/75 space-y-1.5">
                <p class="eyebrow text-[10px] text-gold-300 mb-2">Rezumat cerere</p>
                <p><span class="text-white/50">Eveniment:</span> {{ getEventLabel(form.value.event_type) }}</p>
                <p><span class="text-white/50">Dată:</span> {{ form.value.event_date }}</p>
                <p><span class="text-white/50">Invitați:</span> {{ form.value.guests }}</p>
                <p><span class="text-white/50">Contact:</span> {{ form.value.full_name }} · {{ form.value.email }} · {{ form.value.phone }}</p>
              </div>
            </div>

            <!-- Feedback -->
            <div *ngIf="error()" class="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 text-rose-100 text-sm p-4">{{ error() }}</div>
            <div *ngIf="success()" class="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-100 text-sm p-4 animate-[routeIn_.6s_ease]">
              Mulțumim! Cererea a fost trimisă cu succes. Te contactăm în scurt timp.
            </div>

            <!-- Actions -->
            <div class="mt-8 flex items-center justify-between">
              <button type="button" *ngIf="step() > 1" (click)="prev()" class="text-white/70 hover:text-white text-sm tracking-widest uppercase">← Înapoi</button>
              <span *ngIf="step() === 1"></span>
              <button *ngIf="step() < 3" type="button" (click)="nextStep()" [disabled]="!stepValid()" class="btn btn-primary disabled:opacity-50">Continuă →</button>
              <button *ngIf="step() === 3" type="submit" [disabled]="submitting()" class="btn btn-primary disabled:opacity-50">
                {{ submitting() ? 'Se trimite...' : 'Trimite cererea' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .input {
      @apply mt-2 block w-full bg-ink-900/60 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 outline-none transition-all duration-300;
    }
    .input:focus { @apply border-gold-400 ring-2 ring-gold-400/20 bg-ink-900/80; }
  `]
})
export class BookingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly bookings = inject(BookingService);

  readonly events: EventOption[] = [
    { id: 'nunta', label: 'Nuntă' },
    { id: 'botez', label: 'Botez' },
    { id: 'cununie', label: 'Cununie' },
    { id: 'aniversare', label: 'Aniversare' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'private', label: 'Privat' },
    { id: 'garden', label: 'Garden Party' },
    { id: 'altul', label: 'Altul' }
  ];

  readonly step = signal(1);
  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedDate = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    event_type: ['nunta' as EventType, Validators.required],
    guests: [80, [Validators.required, Validators.min(1), Validators.max(2000)]],
    event_date: ['', Validators.required],
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['']
  });

  onDate(iso: string): void {
    this.selectedDate.set(iso);
    this.form.patchValue({ event_date: iso });
  }

  stepLabel(s: number): string {
    return ({ 1: 'Eveniment', 2: 'Contact', 3: 'Confirmare' } as Record<number, string>)[s];
  }

  stepValid(): boolean {
    const v = this.form.value;
    if (this.step() === 1) return !!v.event_type && !!v.event_date && (v.guests ?? 0) > 0;
    if (this.step() === 2) return this.form.get('full_name')!.valid && this.form.get('phone')!.valid && this.form.get('email')!.valid;
    return this.form.valid;
  }

  nextStep(): void { if (this.stepValid()) this.step.update((s) => Math.min(3, s + 1)); }
  prev(): void { this.step.update((s) => Math.max(1, s - 1)); }

  getEventLabel(id?: EventType): string { return this.events.find((e) => e.id === id)?.label ?? ''; }

  submit(): void {
    if (!this.form.valid) return;
    this.error.set(null); this.submitting.set(true);
    this.bookings.createBooking(this.form.getRawValue()).subscribe({
      next: () => { this.submitting.set(false); this.success.set(true); this.form.reset(); this.step.set(1); this.selectedDate.set(null); },
      error: (err) => { this.submitting.set(false); this.error.set(err?.error?.detail || 'A apărut o eroare. Încearcă din nou.'); }
    });
  }
}
