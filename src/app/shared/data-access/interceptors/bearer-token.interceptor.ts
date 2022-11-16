import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  Observable,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { StorageKey } from '../../const';
import { User } from '../api/models';
import { AuthService } from '../api/services';
import { AuthStore } from '../store/auth.store';
import { LocalStorageService } from '../store/local-stogage.service';

@Injectable()
export class BearerTokenInterceptor implements HttpInterceptor {
  private readonly storageService = inject(LocalStorageService);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private isRefreshing = false;
  private refreshTokenRequest$ = new BehaviorSubject<User | null>(null);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const accessToken = this.storageService.getItem<User>(
      StorageKey.User,
    )?.token;
    if (
      accessToken &&
      request.url.includes('api/') &&
      !request.headers.has('Authorization')
    ) {
      return this.addTokenToRequest(request, next, accessToken).pipe(
        catchError((error) => {
          if (
            error instanceof HttpErrorResponse &&
            error.status === HttpStatusCode.Unauthorized &&
            !request.url.includes('user/login')
          ) {
            const user = this.storageService.getItem<User>(StorageKey.User);
            if (!user || !user.refreshToken) {
              return throwError(() => error);
            }
            return this.handle401Error(request, next, user.refreshToken);
          } else {
            return throwError(() => error);
          }
        }),
      );
    }
    return next.handle(request);
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    refreshToken: string,
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenRequest$.next(null);
      return this.authService.refreshToken(refreshToken).pipe(
        tap({
          next: (res) => {
            this.authStore.updateCurrentUser(res);
          },
          error: () => {
            this.authStore.logout();
          },
        }),
        finalize(() => {
          this.isRefreshing = false;
        }),
        switchMap((res) => {
          this.refreshTokenRequest$.next(res);
          return this.addTokenToRequest(request, next, res.token);
        }),
      );
    } else {
      return this.refreshTokenRequest$.pipe(
        filter((x) => !!x),
        take(1),
        switchMap((res) => this.addTokenToRequest(request, next, res!.token)),
      );
    }
  }

  private addTokenToRequest(
    request: HttpRequest<any>,
    next: HttpHandler,
    accessToken: string,
  ): Observable<HttpEvent<any>> {
    const headers = request.headers.set(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    const reqClone = request.clone({
      headers,
    });
    return next.handle(reqClone);
  }
}
