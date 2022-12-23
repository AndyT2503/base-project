import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { injectAppConfig } from '../../config/config.di';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  private readonly appConfig = injectAppConfig();
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!req.url.includes('http')) {
      const reqClone = req.clone({
        url: `${this.appConfig.apiUrl}/${req.url}`,
      });
      return next.handle(reqClone);
    }
    return next.handle(req);
  }
}
