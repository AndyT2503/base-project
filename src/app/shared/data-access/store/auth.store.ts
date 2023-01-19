import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
  tapResponse
} from '@ngrx/component-store';
import { of, switchMap, tap } from 'rxjs';
import { StorageKey } from '../../const';
import { UserLogin } from '../api/models';
import { AuthService } from '../api/services';
import { LocalStorageService } from './local-storage.service';

export interface UserLoginRequest {
  username: string;
  password: string;
}

interface AuthState {
  user: UserLogin | null;
  isAuthenticated: boolean;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};

@Injectable()
export class AuthStore
  extends ComponentStore<AuthState>
  implements OnStoreInit, OnStateInit
{
  private readonly authService = inject(AuthService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);
  readonly username$ = this.select((s) => s.user?.username);
  readonly isAuthenticated$ = this.select((s) => s.isAuthenticated);
  ngrxOnStoreInit() {
    this.setState(initialAuthState);
  }

  ngrxOnStateInit() {
    this.refresh();
  }

  private readonly refresh = this.effect<void>(
    switchMap(() => {
      const user = this.localStorageService.getItem<UserLogin>(StorageKey.User);
      return of(user).pipe(
        tap((response) => {
          this.patchState({
            user: response,
            isAuthenticated: !!response,
          });
        }),
      );
    }),
  );

  readonly login = this.effect<UserLoginRequest>(
    switchMap((userLogin) =>
      this.authService.login(userLogin.username, userLogin.password).pipe(
        tapResponse(
          (response) => {
            this.router.navigate(['']);
            this.updateCurrentUser(response);
          },
          () => {},
        ),
      ),
    ),
  );

  readonly logout = this.effect<void>(
    tap(() => {
      this.localStorageService.removeItem(StorageKey.User);
      this.refresh();
      this.router.navigate(['/login']);
    }),
  );

  updateCurrentUser(response: UserLogin) {
    this.patchState({
      user: response,
      isAuthenticated: !!response,
    });
    this.localStorageService.setItem(StorageKey.User, response);
  }
}
