import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of, switchMap, tap } from 'rxjs';
import { StorageKey } from '../../const';
import { User, UserLogin } from '../api/models';
import { AuthService } from '../api/services';
import { LocalStorageService } from './local-stogage.service';

interface JWT {
  unique_name: string;
  nbf: number;
  exp: number;
  iat: number;
}



interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};

@Injectable({ providedIn: 'root' })
export class AuthStore extends ComponentStore<AuthState> {
  private refreshTokenTimeout!: number;
  readonly username$ = this.select((s) => s.user?.username);
  readonly isAuthenticated$ = this.select((s) => s.isAuthenticated);
  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private nzMessage: NzMessageService
  ) {
    super(initialAuthState);
  }

  init(): void {
    const user = this.localStorageService.getItem<User>(StorageKey.User);
    if (user) {
      this.startTimerRefreshToken();
    }
    this.refresh();
  }

  private readonly refresh = this.effect<void>(
    switchMap(() => {
      const user = this.localStorageService.getItem<User>(StorageKey.User);
      return of(user).pipe(
        tap((response) => {
          this.patchState({
            user: response,
            isAuthenticated: !!response,
          });
        })
      );
    })
  );

  readonly login = this.effect<UserLogin>(
    switchMap((userLogin) =>
      this.authService.login(userLogin.username, userLogin.password).pipe(
        tapResponse(
          (response) => {
            this.router.navigate(['']);
            this.patchState({
              user: response,
              isAuthenticated: !!response,
            });
            this.localStorageService.setItem(StorageKey.User, response);
            this.startTimerRefreshToken();
          },
          (error: HttpErrorResponse) => {
            this.nzMessage.error(error.error.detail);
          }
        )
      )
    )
  );

  readonly logout = this.effect<void>(
    tap(() => {
      this.localStorageService.removeItem(StorageKey.User);
      this.refresh();
      this.stopTimerRefreshToken();
      this.router.navigate(['/login']);
    })
  );

  private parseJwt(token: string): JWT {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload) as JWT;
  }

  private startTimerRefreshToken(): void {
    const { token, refreshToken } =
      this.localStorageService.getItem<User>(StorageKey.User)!;
    const jwt = this.parseJwt(token);
    const exp = new Date(jwt.exp * 1000);
    const timeout = exp.getTime() - Date.now();
    this.refreshTokenTimeout = window.setTimeout(() => {
      this.refreshToken(refreshToken);
    }, timeout);
  }

  private stopTimerRefreshToken(): void {
    clearTimeout(this.refreshTokenTimeout);
  }

  readonly refreshToken = this.effect<string>(
    switchMap((refreshToken) =>
      this.authService.refreshToken(refreshToken).pipe(
        tapResponse(
          (response) => {
            this.patchState({
              user: response,
              isAuthenticated: !!response,
            });
            this.localStorageService.setItem(StorageKey.User, response);
            this.startTimerRefreshToken();
          },
          () => {
            this.localStorageService.removeItem(StorageKey.User);
            this.refresh();
            this.router.navigateByUrl('login');
          }
        )
      )
    )
  );
}
