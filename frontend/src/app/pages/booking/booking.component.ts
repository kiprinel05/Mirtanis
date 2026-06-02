import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { AvailabilityCalendarComponent } from './components/availability-calendar.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { BookingService } from '../../core/services/booking.service';
import { DayStatus, EventType, Venue } from '../../core/models/api.models';

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'nunta', label: 'Nuntă' },
  { value: 'botez', label: 'Botez' },
  { value: 'cununie', label: 'Cununie' },
  { value: 'aniversare', label: 'Aniversare' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'private', label: 'Eveniment privat' },
  { value: 'garden', label: 'Garden party' },
  { value: 'altul', label: 'Altul' }
];

const VENUES: { value: Venue; label: string; hint: string; icon: string }[] = [
  { value: 'cort', label: 'Cort Premium pe Lac', hint: 'până la 200 invitați', icon: 'festival' },
  { value: 'sala', label: 'Sala Interioară', hint: 'până la 100 invitați', icon: 'meeting_room' }
];

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeaderComponent, AvailabilityCalendarComponent, RevealDirective],
  template: `
    <app-page-header
      eyebrow="Rezervări"
      title="Verifică disponibilitatea"
      subtitle="Alege data dorită din calendar și completează detaliile — îți răspundem cu o ofertă personalizată."
      [image]="headerImg" />

    <section class="section">
      <div class="container-x grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <!-- Calendar -->
        <div class="card h-fit p-6 sm:p-8" appReveal="left">
          <h2 class="mb-1 font-display text-2xl text-ink-900">Calendar disponibilitate</h2>
          <p class="mb-6 text-sm text-ink-500">Zilele verzi sunt libere. Apasă pe o zi pentru a o selecta.</p>
          <app-availability-calendar
            [days]="days()"
            [selected]="selectedDay()"
            (daySelected)="onDayPicked($event)"
            (monthChanged)="loadMonth($event)" />
        </div>

        <!-- Stepper form -->
        <div class="card p-6 sm:p-8" appReveal="right" [revealDelay]="120">
          <ol class="mb-8 flex items-center">
            @for (s of stepLabels; track s; let i = $index) {
              <li class="flex flex-1 items-center last:flex-none">
                <div class="flex flex-col items-center">
                  <span class="grid h-9 w-9 place-items-center rounded-full text-sm font-medium transition"
                        [class.bg-gold-500]="step() >= i + 1"
                        [class.text-cream-50]="step() >= i + 1"
                        [class.bg-cream-300]="step() < i + 1"
                        [class.text-ink-500]="step() < i + 1">{{ i + 1 }}</span>
                  <span class="mt-1.5 hidden text-[10px] uppercase tracking-widest2 text-ink-500 sm:block">{{ s }}</span>
                </div>
                @if (i < 2) {
                  <span class="mx-2 h-px flex-1 transition" [class.bg-gold-400]="step() > i + 1" [class.bg-cream-300]="step() <= i + 1"></span>
                }
              </li>
            }
          </ol>

          @if (success()) {
            <div class="py-10 text-center">
              <div class="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-sage-100 text-sage-600"><span class="mi text-[34px]">check</span></div>
              <h3 class="font-display text-3xl text-ink-900">Cererea a fost trimisă!</h3>
              <p class="mx-auto mt-3 max-w-sm text-ink-600">
                Mulțumim! Te vom contacta în cel mai scurt timp pentru a confirma detaliile evenimentului tău.
              </p>
              <button class="btn btn-outline mt-8" (click)="reset()">Trimite o nouă cerere</button>
            </div>
          } @else {
            <form [formGroup]="form" (ngSubmit)="submit()">
              <!-- STEP 1 — event -->
              @if (step() === 1) {
                <div class="space-y-5">
                  <div>
                    <label class="field-label">Tip eveniment</label>
                    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      @for (t of eventTypes; track t.value) {
                        <button type="button" (click)="form.controls.event_type.setValue(t.value)"
                                class="rounded-xl border px-3 py-2.5 text-sm transition"
                                [class.border-gold-500]="form.value.event_type === t.value"
                                [class.bg-gold-50]="form.value.event_type === t.value"
                                [class.text-gold-700]="form.value.event_type === t.value"
                                [class.border-cream-400]="form.value.event_type !== t.value"
                                [class.text-ink-600]="form.value.event_type !== t.value">
                          {{ t.label }}
                        </button>
                      }
                    </div>
                  </div>

                  <div>
                    <label class="field-label">Locație</label>
                    <div class="grid gap-2 sm:grid-cols-2">
                      @for (v of venues; track v.value) {
                        <button type="button" (click)="form.controls.venue.setValue(v.value)"
                                class="flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition"
                                [class.border-gold-500]="form.value.venue === v.value"
                                [class.bg-gold-50]="form.value.venue === v.value"
                                [class.border-cream-400]="form.value.venue !== v.value">
                          <span class="mi text-[24px]"
                                [class.text-gold-600]="form.value.venue === v.value"
                                [class.text-ink-400]="form.value.venue !== v.value">{{ v.icon }}</span>
                          <span>
                            <span class="block text-sm font-medium"
                                  [class.text-gold-700]="form.value.venue === v.value"
                                  [class.text-ink-700]="form.value.venue !== v.value">{{ v.label }}</span>
                            <span class="block text-xs text-ink-400">{{ v.hint }}</span>
                          </span>
                        </button>
                      }
                    </div>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label class="field-label">Data evenimentului</label>
                      <input class="field" formControlName="event_date" type="date" [min]="todayIso" />
                    </div>
                    <div>
                      <label class="field-label">Număr invitați</label>
                      <input class="field" formControlName="guests" type="number" min="1" max="2000" placeholder="ex. 150" />
                    </div>
                  </div>
                  <div class="flex justify-end">
                    <button type="button" class="btn btn-gold" (click)="nextStep()" [disabled]="!step1Valid()">Continuă</button>
                  </div>
                </div>
              }

              <!-- STEP 2 — contact -->
              @if (step() === 2) {
                <div class="space-y-5">
                  <div>
                    <label class="field-label">Nume complet</label>
                    <input class="field" formControlName="full_name" type="text" placeholder="Numele tău" />
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label class="field-label">Telefon</label>
                      <input class="field" formControlName="phone" type="tel" placeholder="07XX XXX XXX" />
                    </div>
                    <div>
                      <label class="field-label">Email</label>
                      <input class="field" formControlName="email" type="email" placeholder="email@exemplu.ro" />
                    </div>
                  </div>
                  <div>
                    <label class="field-label">Mesaj (opțional)</label>
                    <textarea class="field min-h-[110px] resize-none" formControlName="message" placeholder="Spune-ne mai multe despre evenimentul tău…"></textarea>
                  </div>
                  <div class="flex justify-between">
                    <button type="button" class="btn btn-ghost" (click)="prevStep()"><span class="mi text-[18px]">arrow_back</span> Înapoi</button>
                    <button type="button" class="btn btn-gold" (click)="nextStep()" [disabled]="!step2Valid()">Continuă</button>
                  </div>
                </div>
              }

              <!-- STEP 3 — confirm -->
              @if (step() === 3) {
                <div class="space-y-5">
                  <h3 class="font-display text-2xl text-ink-900">Confirmă detaliile</h3>
                  <dl class="divide-y divide-cream-300 rounded-2xl border border-cream-300 bg-cream-100">
                    @for (row of summary(); track row.k) {
                      <div class="flex justify-between gap-4 px-4 py-3 text-sm">
                        <dt class="text-ink-500">{{ row.k }}</dt>
                        <dd class="text-right font-medium text-ink-800">{{ row.v }}</dd>
                      </div>
                    }
                  </dl>
                  @if (error()) { <p class="text-sm text-blush-400">{{ error() }}</p> }
                  <div class="flex justify-between">
                    <button type="button" class="btn btn-ghost" (click)="prevStep()"><span class="mi text-[18px]">arrow_back</span> Înapoi</button>
                    <button type="submit" class="btn btn-gold" [disabled]="loading()">
                      {{ loading() ? 'Se trimite…' : 'Trimite cererea' }}
                    </button>
                  </div>
                </div>
              }
            </form>
          }
        </div>
      </div>
    </section>
  `
})
export class BookingComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(BookingService);

  readonly headerImg = '/rezervari/hero.jpg';
  readonly eventTypes = EVENT_TYPES;
  readonly venues = VENUES;
  readonly stepLabels = ['Eveniment', 'Contact', 'Confirmare'];
  readonly todayIso = new Date().toISOString().slice(0, 10);

  readonly step = signal(1);
  readonly days = signal<DayStatus[]>([]);
  readonly selectedDay = signal<string | null>(null);
  readonly loading = signal(false);
  readonly success = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    event_type: ['nunta' as EventType, Validators.required],
    venue: ['cort' as Venue, Validators.required],
    event_date: ['', Validators.required],
    guests: [100, [Validators.required, Validators.min(1), Validators.max(2000)]],
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['']
  });

  readonly summary = computed(() => {
    const v = this.form.getRawValue();
    const label = EVENT_TYPES.find((t) => t.value === v.event_type)?.label ?? v.event_type;
    const venueLabel = VENUES.find((x) => x.value === v.venue)?.label ?? v.venue;
    return [
      { k: 'Eveniment', v: label },
      { k: 'Locație', v: venueLabel },
      { k: 'Data', v: v.event_date || '—' },
      { k: 'Invitați', v: String(v.guests) },
      { k: 'Nume', v: v.full_name },
      { k: 'Telefon', v: v.phone },
      { k: 'Email', v: v.email }
    ];
  });

  ngOnInit(): void {
    const now = new Date();
    this.loadMonth({
      start: this.iso(new Date(now.getFullYear(), now.getMonth(), 1)),
      end: this.iso(new Date(now.getFullYear(), now.getMonth() + 1, 0))
    });
  }

  loadMonth(range: { start: string; end: string }): void {
    this.api.getCalendar(range.start, range.end).subscribe({
      next: (res) => this.days.set(res.days),
      error: () => this.days.set([])
    });
  }

  onDayPicked(iso: string): void {
    this.selectedDay.set(iso);
    this.form.controls.event_date.setValue(iso);
  }

  step1Valid(): boolean {
    return this.form.controls.event_type.valid && this.form.controls.venue.valid
      && this.form.controls.event_date.valid && this.form.controls.guests.valid;
  }
  step2Valid(): boolean {
    return this.form.controls.full_name.valid && this.form.controls.phone.valid && this.form.controls.email.valid;
  }

  nextStep(): void {
    if (this.step() === 1 && !this.step1Valid()) return;
    if (this.step() === 2 && !this.step2Valid()) return;
    this.step.update((s) => Math.min(3, s + 1));
  }
  prevStep(): void { this.step.update((s) => Math.max(1, s - 1)); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set(null);
    this.api.createBooking(this.form.getRawValue()).subscribe({
      next: () => { this.loading.set(false); this.success.set(true); },
      error: (e) => {
        this.loading.set(false);
        this.error.set(e?.error?.detail?.[0]?.msg ?? e?.error?.detail ?? 'A apărut o eroare. Încearcă din nou.');
      }
    });
  }

  reset(): void {
    this.form.reset({ event_type: 'nunta', venue: 'cort', guests: 100, event_date: '', full_name: '', phone: '', email: '', message: '' });
    this.selectedDay.set(null);
    this.step.set(1);
    this.success.set(false);
  }

  private iso(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
