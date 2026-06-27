import { Injectable, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AdminProfile, TokenResponse } from '../../shared/models/gallery.models';

const STORAGE_KEY = 'foto-bugeac-admin-token';
const PROFILE_KEY = 'foto-bugeac-admin-profile';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly token = signal<string | null>(null);
  private readonly profile = signal<AdminProfile | null>(null);

  readonly isAuthenticated = computed(() => this.token() !== null);
  readonly currentProfile = computed(() => this.profile());

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const t = localStorage.getItem(STORAGE_KEY);
        if (t) this.token.set(t);
        const p = localStorage.getItem(PROFILE_KEY);
        if (p) this.profile.set(JSON.parse(p));
      } catch {
        /* ignore */
      }
    }
  }

  getToken(): string | null {
    return this.token();
  }

  async login(email: string, password: string): Promise<AdminProfile> {
    const res = await firstValueFrom(
      this.http.post<TokenResponse>(
        `${environment.apiBaseUrl}/auth/login`,
        { email, password },
      ),
    );
    this.token.set(res.access_token);
    this.persist(STORAGE_KEY, res.access_token);

    const me = await firstValueFrom(
      this.http.get<AdminProfile>(`${environment.apiBaseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${res.access_token}` },
      }),
    );
    this.profile.set(me);
    this.persist(PROFILE_KEY, JSON.stringify(me));
    return me;
  }

  logout(): void {
    this.token.set(null);
    this.profile.set(null);
    this.persist(STORAGE_KEY, null);
    this.persist(PROFILE_KEY, null);
  }

  private persist(key: string, value: string | null): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  }
}
