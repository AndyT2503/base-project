import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthStore } from '../store/auth.store';

export function authGuard(): CanMatchFn {
  return (route, segments) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);
    return authStore.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) return true;
        return router.createUrlTree(['/login']);
      }),
      take(1),
    );
  };
}
