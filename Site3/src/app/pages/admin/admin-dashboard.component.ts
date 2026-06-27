import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AdminApiService } from '../../core/services/admin-api.service';
import { EventAdminOut } from '../../shared/models/gallery.models';

@Component({
  selector: 'fb-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="flex flex-wrap items-end justify-between gap-4 mb-10">
      <div>
        <h1 class="font-display text-4xl md:text-5xl text-offwhite mb-2">Evenimente</h1>
        <p class="text-offwhite/60 text-sm">Creează o galerie privată pentru fiecare eveniment al studioului.</p>
      </div>
      <button (click)="creating.set(true)" class="btn-primary">+ Eveniment nou</button>
    </div>

    @if (creating()) {
      <div class="glass-strong rounded-2xl p-7 mb-10">
        <h2 class="font-display text-2xl mb-5">Eveniment nou</h2>
        <form (submit)="create($event)" class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label class="block md:col-span-2">
            <span class="text-xs tracking-[0.3em] uppercase text-offwhite/50">Titlu</span>
            <input
              [(ngModel)]="form.title" name="title" required
              class="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-offwhite focus:outline-none focus:border-gold"
            />
          </label>

          <label class="block">
            <span class="text-xs tracking-[0.3em] uppercase text-offwhite/50">Client</span>
            <input
              [(ngModel)]="form.client_name" name="client"
              class="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-offwhite focus:outline-none focus:border-gold"
            />
          </label>

          <label class="block">
            <span class="text-xs tracking-[0.3em] uppercase text-offwhite/50">Data evenimentului</span>
            <input
              type="date" [(ngModel)]="form.event_date" name="event_date"
              class="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-offwhite focus:outline-none focus:border-gold"
            />
          </label>

          <label class="block">
            <span class="text-xs tracking-[0.3em] uppercase text-offwhite/50">Expirare link (opțional)</span>
            <input
              type="date" [(ngModel)]="form.expires_at" name="expires_at"
              class="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-offwhite focus:outline-none focus:border-gold"
            />
          </label>

          <label class="block">
            <span class="text-xs tracking-[0.3em] uppercase text-offwhite/50">Parolă galerie (opțional)</span>
            <input
              type="text" [(ngModel)]="form.access_password" name="access_password"
              class="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-offwhite focus:outline-none focus:border-gold"
            />
          </label>

          <label class="block md:col-span-2">
            <span class="text-xs tracking-[0.3em] uppercase text-offwhite/50">Descriere</span>
            <textarea
              [(ngModel)]="form.description" name="description" rows="3"
              class="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-offwhite focus:outline-none focus:border-gold resize-none"
            ></textarea>
          </label>

          <div class="md:col-span-2 flex items-center gap-3 justify-end">
            <button type="button" (click)="cancelCreate()" class="px-5 py-2 rounded-full border border-white/10 text-sm">Anulează</button>
            <button type="submit" [disabled]="saving()" class="btn-primary disabled:opacity-60">
              @if (saving()) { Se creează… } @else { Creează eveniment }
            </button>
          </div>
          @if (createError()) {
            <p class="md:col-span-2 text-xs text-red-400">{{ createError() }}</p>
          }
        </form>
      </div>
    }

    @if (loading()) {
      <p class="text-offwhite/60 text-sm">Se încarcă…</p>
    } @else if (events().length === 0) {
      <div class="glass-strong rounded-2xl p-10 text-center text-offwhite/60">
        Nu ai încă niciun eveniment. Apasă <strong>+ Eveniment nou</strong> ca să creezi prima galerie.
      </div>
    } @else {
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (e of events(); track e.id) {
          <a
            [routerLink]="['/admin/event', e.id]"
            class="glass rounded-2xl p-6 hover:-translate-y-1 hover:shadow-glow transition-all block"
          >
            <div class="flex items-start justify-between gap-3 mb-3">
              <h3 class="font-display text-xl text-offwhite leading-tight">{{ e.title }}</h3>
              <span
                class="text-[10px] tracking-[0.25em] uppercase px-2 py-1 rounded-full border"
                [ngClass]="
                  e.status === 'published'
                    ? 'border-gold text-gold'
                    : 'border-white/15 text-offwhite/50'
                "
              >{{ statusLabel(e.status) }}</span>
            </div>
            @if (e.client_name) {
              <p class="text-sm text-offwhite/70 mb-3">{{ e.client_name }}</p>
            }
            <div class="flex items-center gap-4 text-xs text-offwhite/50">
              <span>📸 {{ e.image_count }} cadre</span>
              @if (e.has_password) { <span>🔒 protejat</span> }
              @if (e.is_expired) { <span class="text-red-400">expirat</span> }
            </div>
            @if (e.event_date) {
              <p class="mt-3 text-[10px] tracking-[0.3em] uppercase text-offwhite/40">
                {{ formatDate(e.event_date) }}
              </p>
            }
          </a>
        }
      </div>
    }
  `,
})
export class AdminDashboardComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly router = inject(Router);

  protected readonly events = signal<EventAdminOut[]>([]);
  protected readonly loading = signal(true);
  protected readonly creating = signal(false);
  protected readonly saving = signal(false);
  protected readonly createError = signal('');

  protected form = {
    title: '',
    client_name: '',
    event_date: '',
    expires_at: '',
    access_password: '',
    description: '',
  };

  ngOnInit(): void {
    this.refresh();
  }

  private async refresh(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.api.listEvents());
      this.events.set(res.items);
    } finally {
      this.loading.set(false);
    }
  }

  protected cancelCreate(): void {
    this.creating.set(false);
    this.createError.set('');
  }

  protected async create(e: Event): Promise<void> {
    e.preventDefault();
    this.createError.set('');
    this.saving.set(true);
    try {
      const created = await firstValueFrom(
        this.api.createEvent({
          title: this.form.title,
          client_name: this.form.client_name || null,
          description: this.form.description || null,
          // <input type="date"> gives us "YYYY-MM-DD". For event_date we
          // pick local noon so timezone shifts can't cross day boundaries.
          // For expires_at we pick end-of-day local so "expires today"
          // means "valid until tonight", not "expired at midnight UTC".
          event_date: this.form.event_date
            ? new Date(this.form.event_date + 'T12:00:00').toISOString()
            : null,
          expires_at: this.form.expires_at
            ? new Date(this.form.expires_at + 'T23:59:59').toISOString()
            : null,
          access_password: this.form.access_password || null,
        }),
      );
      this.creating.set(false);
      this.router.navigate(['/admin/event', created.id]);
    } catch (err: unknown) {
      this.createError.set(this.extractError(err));
    } finally {
      this.saving.set(false);
    }
  }

  /**
   * FastAPI returns `detail` as either a string (custom HTTPException) or
   * an array of `{loc, msg, type}` records (Pydantic validation 422).
   * Turn either shape into something readable.
   */
  private extractError(err: unknown): string {
    const e = err as { error?: { detail?: unknown } };
    const detail = e?.error?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item: { loc?: unknown[]; msg?: string }) => {
          const field = (item.loc || []).slice(-1)[0] ?? 'câmp';
          return `${field}: ${item.msg || 'invalid'}`;
        })
        .join(' · ');
    }
    return 'Crearea evenimentului a eșuat.';
  }

  protected statusLabel(s: string): string {
    if (s === 'published') return 'Publicat';
    if (s === 'draft') return 'Ciornă';
    return 'Expirat';
  }

  protected formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString('ro-RO', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch {
      return iso;
    }
  }
}
