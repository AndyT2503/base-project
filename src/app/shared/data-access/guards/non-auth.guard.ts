import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  CanMatch,
  Route,
  Router,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthStore } from '../store/auth.store';

@Injectable({ providedIn: 'root' })
export class NonAuthGuard implements CanActivate, CanLoad, CanMatch {
  constructor(private authStore: AuthStore, private router: Router) {}
  canMatch(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.isUnauthenticated$();
  }

  canLoad(): Observable<boolean | UrlTree> {
    return this.isUnauthenticated$();
  }

  canActivate(): Observable<boolean | UrlTree> {
    return this.isUnauthenticated$();
  }

  private isUnauthenticated$() {
    return this.authStore.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) return true;
        return this.router.createUrlTree(['/']);
      }),
      take(1)
    );
  }
}
