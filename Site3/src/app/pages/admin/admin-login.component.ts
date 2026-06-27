import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminAuthService } from '../../core/services/admin-auth.service';

@Component({
  selector: 'fb-admin-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="min-h-screen bg-primary flex items-center justify-center px-4 relative overflow-hidden">
      <div class="glow-orb glow-orb--gold w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"></div>

      <div class="relative w-full max-w-md glass-strong rounded-2xl p-8 md:p-10">
        <div class="text-center mb-8">
          <img
            src="assets/logo/log-mic.png"
            alt="Foto Bugeac"
            class="h-14 w-auto mx-auto mb-4"
          />
          <h1 class="font-display text-3xl text-offwhite mb-1">Studio</h1>
          <p class="text-xs tracking-[0.3em] uppercase text-gold/70">Acces administrare</p>
        </div>

        @if (sessionExpired) {
          <div class="mb-5 px-4 py-3 rounded-xl bg-gold/8 border border-gold/30 text-gold/90 text-xs text-center">
            ⏱ Sesiunea ta a expirat. Te rugăm să te autentifici din nou.
          </div>
        }

        <form (submit)="submit($event)" class="space-y-4">
          <label class="block">
            <span class="text-xs tracking-[0.3em] uppercase text-offwhite/50">Email</span>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              autocomplete="email"
              class="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-offwhite focus:outline-none focus:border-gold"
            />
          </label>

          <label class="block">
            <span class="text-xs tracking-[0.3em] uppercase text-offwhite/50">Parolă</span>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              autocomplete="current-password"
              class="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-offwhite focus:outline-none focus:border-gold"
            />
          </label>

          @if (error()) {
            <p class="text-xs text-red-400">{{ error() }}</p>
          }

          <button
            type="submit"
            [disabled]="loading()"
            class="btn-primary w-full disabled:opacity-60"
          >
            @if (loading()) { Se conectează… } @else { Conectare }
          </button>
        </form>
      </div>
    </section>
  `,
})
export class AdminLoginComponent {
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected email = '';
  protected password = '';
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  /** True when the user landed here because their JWT expired. */
  protected readonly sessionExpired =
    this.route.snapshot.queryParamMap.get('reason') === 'expired';

  protected async submit(e: Event): Promise<void> {
    e.preventDefault();
    this.error.set('');
    this.loading.set(true);
    try {
      await this.auth.login(this.email, this.password);
      const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/admin';
      this.router.navigateByUrl(redirect);
    } catch (err: unknown) {
      const e = err as { error?: { detail?: string } };
      this.error.set(e?.error?.detail || 'Autentificare eșuată.');
    } finally {
      this.loading.set(false);
    }
  }
}
