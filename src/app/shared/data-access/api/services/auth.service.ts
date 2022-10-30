import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  login(username: string, password: string): Observable<User> {
    return this.httpClient.post<User>('api/user/login', {
      username,
      password,
    });
  }

  refreshToken(refreshToken: string): Observable<User> {
    return this.httpClient.post<User>('api/user/refresh-token', {
      refreshToken,
    });
  }
}
