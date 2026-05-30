import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-[100svh] flex items-center justify-center px-6 pt-32 pb-20 relative overflow-hidden">
      <div class="absolute inset-0 bg-lux-radial"></div>
      <form [formGroup]="form" (ngSubmit)="submit()"
            class="relative z-10 w-full max-w-md glass rounded-3xl p-9 shadow-glow-gold">
        <h1 class="font-display text-4xl text-white">Admin · <span class="gold-text">Mirtanis</span></h1>
        <p class="mt-2 text-white/60 text-sm">Acces restricționat. Folosește contul de administrator.</p>

        <div class="divider-gold w-16 mt-7"></div>

        <div class="mt-7 space-y-5">
          <div>
            <label class="eyebrow text-[10px]">Email</label>
            <input type="email" formControlName="email" class="input" autocomplete="email"/>
          </div>
          <div>
            <label class="eyebrow text-[10px]">Parolă</label>
            <input type="password" formControlName="password" class="input" autocomplete="current-password"/>
          </div>
        </div>

        <div *ngIf="error()" class="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 text-rose-100 text-sm p-4">{{ error() }}</div>

        <button type="submit" [disabled]="!form.valid || loading()" class="btn btn-primary w-full justify-center mt-7 disabled:opacity-50">
          {{ loading() ? 'Se autentifică...' : 'Autentificare' }}
        </button>
      </form>
    </section>
  `,
  styles: [`
    .input { @apply mt-2 block w-full bg-ink-900/60 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 outline-none transition-all duration-300; }
    .input:focus { @apply border-gold-400 ring-2 ring-gold-400/20 bg-ink-900/80; }
  `]
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (!this.form.valid) return;
    const { email, password } = this.form.getRawValue();
    this.loading.set(true); this.error.set(null);
    this.auth.login(email, password).subscribe({
      next: () => { this.loading.set(false); this.router.navigateByUrl('/admin'); },
      error: (err) => { this.loading.set(false); this.error.set(err?.error?.detail || 'Date de autentificare invalide.'); }
    });
  }
}
