import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IMAGES } from '../../../shared/data/images';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-24">
      <div class="absolute inset-0">
        <img [src]="bg" alt="" class="h-full w-full object-cover" />
        <div class="absolute inset-0 bg-cream-100/92"></div>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="card relative z-10 w-full max-w-md p-8 sm:p-10">
        <a routerLink="/" class="mb-6 inline-flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-gold-600">← Înapoi pe site</a>
        <img src="/logo-mare.png" alt="Mirtanis Events" class="h-12 w-auto" style="filter: drop-shadow(0 1px 4px rgba(120,90,30,.3));" />
        <h1 class="mt-4 font-display text-3xl text-ink-900">Panou administrare</h1>
        <p class="mt-2 text-sm text-ink-500">Autentifică-te cu contul de administrator.</p>

        <div class="mt-8 space-y-5">
          <div>
            <label class="field-label">Email</label>
            <input class="field" type="email" formControlName="email" autocomplete="email" placeholder="admin@mirtanis.ro" />
          </div>
          <div>
            <label class="field-label">Parolă</label>
            <input class="field" type="password" formControlName="password" autocomplete="current-password" placeholder="••••••••" />
          </div>
        </div>

        @if (error()) {
          <p class="mt-5 rounded-xl border border-blush-200 bg-blush-50 p-3 text-sm text-blush-400">{{ error() }}</p>
        }

        <button type="submit" class="btn btn-gold mt-7 w-full" [disabled]="!form.valid || loading()">
          {{ loading() ? 'Se autentifică…' : 'Autentificare' }}
        </button>
      </form>
    </section>
  `
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly bg = IMAGES.hallInterior;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (!this.form.valid) return;
    const { email, password } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);
    this.auth.login(email, password).subscribe({
      next: () => { this.loading.set(false); this.router.navigateByUrl('/admin'); },
      error: (err) => { this.loading.set(false); this.error.set(err?.error?.detail || 'Date de autentificare invalide.'); }
    });
  }
}
