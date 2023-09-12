import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export function authGuard(): CanMatchFn {
  return (route, segments) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);
    const isAuthenticated = authStore.selectors.isAuthenticated();
    if (isAuthenticated) return true;
    return router.createUrlTree(['/login']);
  };
}
