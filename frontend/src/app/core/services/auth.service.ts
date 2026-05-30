import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthToken } from '../models/api.models';

const TOKEN_KEY = 'mirtanis_admin_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _token = signal<string | null>(this.readToken());

  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());

  login(email: string, password: string): Observable<AuthToken> {
    return this.http
      .post<AuthToken>(`${environment.apiUrl}/auth/login-json`, { email, password })
      .pipe(tap((res) => this.setToken(res.access_token)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this._token.set(token);
  }

  private readToken(): string | null {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  }
}
