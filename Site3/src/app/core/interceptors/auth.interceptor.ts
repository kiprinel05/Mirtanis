import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AdminAuthService } from '../services/admin-auth.service';

/**
 * Catches 401 responses on admin endpoints, clears the stale token,
 * and bounces the user back to /admin/login with a redirect query
 * param so they land where they came from after re-authentication.
 *
 * Public endpoints (gallery, booking) are untouched.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: { status?: number }) => {
      const isAuthError = err?.status === 401;
      const isAdminCall = /\/(auth|events)(\/|$|\?)/.test(req.url);

      if (isAuthError && isAdminCall && auth.isAuthenticated()) {
        auth.logout();
        const currentUrl = router.url;
        const redirect =
          currentUrl.startsWith('/admin') && currentUrl !== '/admin/login'
            ? currentUrl
            : '/admin';
        router.navigate(['/admin/login'], {
          queryParams: { redirect, reason: 'expired' },
        });
      }
      return throwError(() => err);
    }),
  );
};
