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
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
            this.updateCurrentUser(response);
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
      this.router.navigate(['/login']);
    })
  );

  updateCurrentUser(response: User) {
    this.patchState({
      user: response,
      isAuthenticated: !!response,
    });
    this.localStorageService.setItem(StorageKey.User, response);
  }
}
