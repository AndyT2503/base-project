import { inject, Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild, CanMatch,
  Route,
  Router,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthStore } from '../store/auth.store';

@Injectable({ providedIn: 'root' })
export class AuthGuard
  implements CanActivate, CanActivateChild, CanMatch
{
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);


  canMatch(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.isAuthenticated$();
  }

  canActivate(): Observable<boolean | UrlTree> {
    return this.isAuthenticated$();
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return this.isAuthenticated$();
  }

  private isAuthenticated$() {
    return this.authStore.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) return true;
        return this.router.createUrlTree(['/login']);
      }),
      take(1)
    );
  }
}
