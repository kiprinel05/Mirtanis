import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AdminAuthService } from '../../core/services/admin-auth.service';

@Component({
  selector: 'fb-admin-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-primary text-offwhite">
      <header
        class="sticky top-0 z-30 glass-strong border-b border-white/5 px-6 py-4 flex items-center justify-between"
      >
        <a routerLink="/admin" class="flex items-center gap-3">
          <img
            src="assets/logo/log-mic.png"
            alt="Foto Bugeac"
            class="h-10 w-auto"
          />
          <div class="leading-tight">
            <div class="font-display text-lg">Foto Bugeac</div>
            <div class="text-[10px] tracking-[0.35em] uppercase text-gold/70">Admin</div>
          </div>
        </a>

        <div class="flex items-center gap-4 text-sm">
          @if (auth.currentProfile(); as me) {
            <span class="text-offwhite/60 hidden md:inline">{{ me.email }}</span>
          }
          <a routerLink="/" class="hover-underline text-xs tracking-[0.2em] uppercase text-offwhite/70">
            ← Site
          </a>
          <button
            (click)="logout()"
            class="px-4 py-2 rounded-full border border-white/10 text-xs tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-all"
          >
            Deconectează
          </button>
        </div>
      </header>

      <main class="container-elegant px-6 py-10">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminShellComponent {
  protected readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
