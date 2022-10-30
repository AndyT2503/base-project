import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../api/models';
import { LocalStorageService } from '../store/local-stogage.service';
import { StorageKey } from '../../const';

@Injectable()
export class BearerTokenInterceptor implements HttpInterceptor {

  private readonly storageService = inject(LocalStorageService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.storageService.getItem<User>(StorageKey.User)?.token;
    if (accessToken && request.url.includes('api/') && !request.headers.has('Authorization')) {
      const headers = request.headers.set('Authorization', `Bearer ${accessToken}`);
        const reqClone = request.clone({
          headers,
        });
        return next.handle(reqClone);
    }
    return next.handle(request);
  }
}
