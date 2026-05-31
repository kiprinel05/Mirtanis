import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ContactService } from '../../core/services/contact.service';
import { IMAGES } from '../../shared/data/images';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeaderComponent, RevealDirective],
  template: `
    <app-page-header
      eyebrow="Contact"
      title="Hai să vorbim despre evenimentul tău"
      subtitle="Suntem aici pentru orice întrebare. Scrie-ne și îți răspundem cât mai repede."
      [image]="headerImg" />

    <section class="section">
      <div class="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <!-- Info -->
        <div appReveal="left">
          <p class="eyebrow">Date de contact</p>
          <h2 class="mt-4 font-display text-4xl text-ink-900">Mirtanis Events</h2>
          <p class="mt-4 max-w-md text-ink-600">
            Locație de poveste pe malul lacului. Programează o vizită sau cere o ofertă personalizată.
          </p>

          <ul class="mt-8 space-y-5" appReveal="up" [revealStagger]="90" [revealDelay]="150">
            @for (c of contacts; track c.label) {
              <li class="flex items-start gap-4">
                <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-600"><span class="mi text-[20px]">{{ c.icon }}</span></span>
                <div>
                  <p class="text-xs uppercase tracking-widest2 text-ink-500">{{ c.label }}</p>
                  @if (c.href) {
                    <a [href]="c.href" class="link-underline text-lg text-ink-800 transition-colors hover:text-gold-600">{{ c.value }}</a>
                  } @else {
                    <p class="text-lg text-ink-800">{{ c.value }}</p>
                  }
                </div>
              </li>
            }
          </ul>

          <div class="mt-8 overflow-hidden rounded-3xl border border-cream-300 shadow-soft">
            <iframe
              title="Hartă Mirtanis Events"
              class="h-64 w-full"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=26.0%2C44.4%2C26.2%2C44.5&layer=mapnik">
            </iframe>
          </div>
        </div>

        <!-- Form -->
        <div class="card p-6 sm:p-8" appReveal="right" [revealDelay]="120">
          @if (success()) {
            <div class="py-12 text-center">
              <div class="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-sage-100 text-sage-600"><span class="mi text-[34px]">check</span></div>
              <h3 class="font-display text-3xl text-ink-900">Mesaj trimis!</h3>
              <p class="mx-auto mt-3 max-w-sm text-ink-600">Mulțumim pentru mesaj. Revenim către tine în cel mai scurt timp.</p>
              <button class="btn btn-outline mt-8" (click)="success.set(false)">Trimite alt mesaj</button>
            </div>
          } @else {
            <h3 class="mb-6 font-display text-2xl text-ink-900">Trimite-ne un mesaj</h3>
            <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5" novalidate>
              <div>
                <label class="field-label">Nume complet</label>
                <input class="field" formControlName="full_name" type="text" placeholder="Numele tău" />
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="field-label">Email</label>
                  <input class="field" formControlName="email" type="email" placeholder="email@exemplu.ro" />
                </div>
                <div>
                  <label class="field-label">Telefon (opțional)</label>
                  <input class="field" formControlName="phone" type="tel" placeholder="07XX XXX XXX" />
                </div>
              </div>
              <div>
                <label class="field-label">Subiect (opțional)</label>
                <input class="field" formControlName="subject" type="text" placeholder="ex. Nuntă vara 2026" />
              </div>
              <div>
                <label class="field-label">Mesaj</label>
                <textarea class="field min-h-[130px] resize-none" formControlName="message" placeholder="Spune-ne despre evenimentul tău…"></textarea>
              </div>
              @if (error()) { <p class="text-sm text-blush-400">{{ error() }}</p> }
              <button type="submit" class="btn btn-gold w-full" [disabled]="loading()">
                {{ loading() ? 'Se trimite…' : 'Trimite mesajul' }}
              </button>
            </form>
          }
        </div>
      </div>
    </section>
  `
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ContactService);

  readonly headerImg = IMAGES.lakeReflect;
  readonly loading = signal(false);
  readonly success = signal(false);
  readonly error = signal<string | null>(null);

  readonly contacts = [
    { icon: 'mail', label: 'Email', value: 'contact@mirtanis.ro', href: 'mailto:contact@mirtanis.ro' },
    { icon: 'call', label: 'Telefon', value: '+40 7XX XXX XXX', href: 'tel:+407XXXXXXXX' },
    { icon: 'location_on', label: 'Locație', value: 'Malul Lacului, România', href: null }
  ];

  readonly form = this.fb.nonNullable.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    subject: [''],
    message: ['', [Validators.required, Validators.minLength(5)]]
  });

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set(null);
    this.api.send(this.form.getRawValue()).subscribe({
      next: () => { this.loading.set(false); this.success.set(true); this.form.reset(); },
      error: (e) => {
        this.loading.set(false);
        this.error.set(e?.error?.detail?.[0]?.msg ?? e?.error?.detail ?? 'A apărut o eroare. Încearcă din nou.');
      }
    });
  }
}
