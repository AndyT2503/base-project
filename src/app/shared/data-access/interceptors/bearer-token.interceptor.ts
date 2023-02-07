import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  Observable,
  switchMap,
  take,
  tap,
  throwError
} from 'rxjs';
import { StorageKey } from '../../const';
import { UserLogin } from '../api/models';
import { AuthService } from '../api/services';
import { AuthStore } from '../store/auth.store';
import { LocalStorageService } from '../store/local-storage.service';

export const bearerTokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  const storageService = inject(LocalStorageService);
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);
  const refreshTokenRequest$ = new BehaviorSubject<UserLogin | null>(null);

  let isRefreshing = false;
  function handle401Error(
    request: HttpRequest<any>,
    next: HttpHandlerFn,
    refreshToken: string,
    error: HttpErrorResponse,
  ): Observable<HttpEvent<any>> {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenRequest$.next(null);
      return authService.refreshToken(refreshToken).pipe(
        tap({
          next: (res) => {
            refreshTokenRequest$.next(res);
            authStore.updateCurrentUser(res);
          },
          error: (err) => {
            refreshTokenRequest$.error(err);
            authStore.logout();
          },
        }),
        finalize(() => {
          isRefreshing = false;
        }),
        switchMap((res) => {
          return addTokenToRequest(request, next, res.token);
        }),
      );
    } else {
      return refreshTokenRequest$.pipe(
        filter((x) => !!x),
        take(1),
        switchMap((res) => {
          return addTokenToRequest(request, next, res!.token);
        }),
      );
    }
  }

  function addTokenToRequest(
    request: HttpRequest<any>,
    next: HttpHandlerFn,
    accessToken: string,
  ): Observable<HttpEvent<any>> {
    const headers = request.headers.set(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    const reqClone = request.clone({
      headers,
    });
    return next(reqClone);
  }

  const accessToken = storageService.getItem<UserLogin>(StorageKey.User)?.token;
  if (
    accessToken &&
    request.url.includes('api/') &&
    !request.headers.has('Authorization')
  ) {
    return addTokenToRequest(request, next, accessToken).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === HttpStatusCode.Unauthorized &&
          !request.url.includes('/login') &&
          !request.url.includes('/refresh-token')
        ) {
          const user = storageService.getItem<UserLogin>(StorageKey.User);
          if (!user || !user.refreshToken) {
            return throwError(() => error);
          }
          return handle401Error(request, next, user.refreshToken, error);
        } else {
          return throwError(() => error);
        }
      }),
    );
  }
  return next(request);
};
