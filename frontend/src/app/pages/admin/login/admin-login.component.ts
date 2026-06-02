import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-admin-login",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main
      class="flex min-h-[100svh] items-center justify-center bg-cream-100 px-5 py-10"
    >
      <div class="w-full max-w-md">
        <!-- Back link -->
        <a
          routerLink="/"
          class="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-gold-600"
        >
          <span class="mi text-[18px]">arrow_back</span> Înapoi pe site
        </a>

        <!-- Card -->
        <div class="card overflow-hidden">
          <!-- Header band -->
          <div
            class="flex flex-col items-center gap-4 border-b border-cream-300 bg-cream-50 px-6 py-8 text-center sm:px-10"
          >
            <img
              src="/logo-mare-black.png"
              alt="Mirtanis Events"
              class="h-11 w-auto"
              style="filter: drop-shadow(0 1px 4px rgba(120,90,30,.3));"
            />
            <div>
              <div
                class="mb-2 inline-flex items-center gap-2 rounded-full bg-gold-100 px-3 py-1 text-[10px] font-medium uppercase tracking-widest2 text-gold-700"
              >
                <span class="mi text-[15px]">lock</span> Acces administrator
              </div>
              <h1 class="font-display text-3xl text-ink-900 sm:text-4xl">
                Bine ai revenit
              </h1>
              <p class="mt-1.5 text-sm text-ink-500">
                Autentifică-te pentru a continua în panou.
              </p>
            </div>
          </div>

          <!-- Form -->
          <form
            [formGroup]="form"
            (ngSubmit)="submit()"
            class="space-y-5 px-6 py-8 sm:px-10"
          >
            <div>
              <label class="field-label">Email</label>
              <div class="relative">
                <span
                  class="mi pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-ink-400"
                  >mail</span
                >
                <input
                  class="field pl-11"
                  type="email"
                  inputmode="email"
                  formControlName="email"
                  autocomplete="email"
                  placeholder="admin@mirtanisevents.ro"
                />
              </div>
            </div>

            <div>
              <label class="field-label">Parolă</label>
              <div class="relative">
                <span
                  class="mi pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-ink-400"
                  >lock</span
                >
                <input
                  class="field pl-11 pr-11"
                  [type]="showPass() ? 'text' : 'password'"
                  formControlName="password"
                  autocomplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  (click)="showPass.set(!showPass())"
                  class="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink-400 transition-colors hover:text-gold-600"
                  [attr.aria-label]="
                    showPass() ? 'Ascunde parola' : 'Arată parola'
                  "
                >
                  <span class="mi text-[20px]">{{
                    showPass() ? "visibility_off" : "visibility"
                  }}</span>
                </button>
              </div>
            </div>

            @if (error()) {
              <p
                class="flex items-center gap-2 rounded-xl border border-blush-200 bg-blush-50 p-3 text-sm text-blush-400"
              >
                <span class="mi text-[18px]">error</span> {{ error() }}
              </p>
            }

            <button
              type="submit"
              class="btn btn-gold w-full"
              [disabled]="!form.valid || loading()"
            >
              {{ loading() ? "Se autentifică…" : "Autentificare" }}
            </button>
          </form>
        </div>

        <p class="mt-6 text-center text-xs text-ink-400">
          © {{ year }} Mirtanis Events
        </p>
      </div>
    </main>
  `,
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly year = new Date().getFullYear();
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showPass = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (!this.form.valid) return;
    const { email, password } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl("/admin");
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.detail || "Date de autentificare invalide.");
      },
    });
  }
}
