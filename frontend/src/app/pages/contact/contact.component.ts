import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pt-40 pb-16">
      <div class="container-luxe px-6 max-w-5xl">
        <span class="eyebrow">Contact</span>
        <h1 class="mt-4 font-display text-5xl md:text-7xl text-white">Scrie-ne <span class="gold-text">un cuvânt</span>.</h1>
        <p class="mt-6 text-white/70 max-w-2xl text-lg">Suntem aici pentru a-ți oferi toate detaliile și pentru a programa o vizită privată la Mirtanis.</p>
      </div>
    </section>

    <section class="pb-32">
      <div class="container-luxe px-6 grid lg:grid-cols-2 gap-10">
        <!-- Info -->
        <div appReveal class="space-y-8">
          <div class="glass rounded-3xl p-7">
            <h3 class="font-display text-2xl text-white">Locație</h3>
            <p class="mt-2 text-white/75">Lacul Mirtanis, România</p>
            <p class="mt-1 text-white/55 text-sm">Acces peste podul iluminat — parcare privată gratuită.</p>
          </div>
          <div class="glass rounded-3xl p-7">
            <h3 class="font-display text-2xl text-white">Contact direct</h3>
            <ul class="mt-3 space-y-2 text-white/80">
              <li><span class="eyebrow text-[10px] block">Telefon</span>+40 700 000 000</li>
              <li><span class="eyebrow text-[10px] block mt-2">Email</span>contact&#64;mirtanis.ro</li>
              <li><span class="eyebrow text-[10px] block mt-2">Program vizite</span>Luni — Duminică · 10:00 — 19:00 (cu programare)</li>
            </ul>
          </div>

          <div class="rounded-3xl overflow-hidden border border-white/10 shadow-glass">
            <iframe
              title="Hartă Mirtanis Events"
              class="w-full h-72"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=26.0%2C44.4%2C26.2%2C44.5&layer=mapnik"
            ></iframe>
          </div>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="submit()" appReveal [revealDelay]="150"
              class="glass rounded-3xl p-7 md:p-9 space-y-5" novalidate>
          <div>
            <label class="eyebrow text-[10px]">Nume complet</label>
            <input type="text" formControlName="full_name" class="input" placeholder="Numele tău" />
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="eyebrow text-[10px]">Email</label>
              <input type="email" formControlName="email" class="input" placeholder="email&#64;example.com" />
            </div>
            <div>
              <label class="eyebrow text-[10px]">Telefon</label>
              <input type="tel" formControlName="phone" class="input" placeholder="+40 7..." />
            </div>
          </div>
          <div>
            <label class="eyebrow text-[10px]">Subiect</label>
            <input type="text" formControlName="subject" class="input" placeholder="ex. Vizită nuntă septembrie" />
          </div>
          <div>
            <label class="eyebrow text-[10px]">Mesaj</label>
            <textarea rows="5" formControlName="message" class="input" placeholder="Spune-ne ce eveniment îți dorești..."></textarea>
          </div>

          <div *ngIf="success()" class="rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-100 text-sm p-4">
            Mulțumim! Mesajul a fost trimis. Te contactăm cât mai curând.
          </div>
          <div *ngIf="error()" class="rounded-xl border border-rose-400/30 bg-rose-400/10 text-rose-100 text-sm p-4">{{ error() }}</div>

          <button type="submit" [disabled]="!form.valid || submitting()" class="btn btn-primary w-full justify-center disabled:opacity-50">
            {{ submitting() ? 'Se trimite...' : 'Trimite mesajul' }}
          </button>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .input { @apply mt-2 block w-full bg-ink-900/60 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 outline-none transition-all duration-300; }
    .input:focus { @apply border-gold-400 ring-2 ring-gold-400/20 bg-ink-900/80; }
  `]
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contact = inject(ContactService);

  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    subject: [''],
    message: ['', [Validators.required, Validators.minLength(5)]]
  });

  submit(): void {
    if (!this.form.valid) return;
    this.submitting.set(true); this.error.set(null);
    this.contact.send(this.form.getRawValue()).subscribe({
      next: () => { this.submitting.set(false); this.success.set(true); this.form.reset(); },
      error: (err) => { this.submitting.set(false); this.error.set(err?.error?.detail || 'Eroare la trimitere.'); }
    });
  }
}
