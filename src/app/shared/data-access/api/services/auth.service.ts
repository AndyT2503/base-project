import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLogin } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  login(username: string, password: string): Observable<UserLogin> {
    return this.httpClient.post<UserLogin>('api/user/login', {
      username,
      password,
    });
  }

  refreshToken(refreshToken: string): Observable<UserLogin> {
    return this.httpClient.post<UserLogin>('api/user/refresh-token', {
      refreshToken,
    });
  }
}
