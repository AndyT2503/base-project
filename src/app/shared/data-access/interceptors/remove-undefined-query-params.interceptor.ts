import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class RemoveUndefinedQueryParamsInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('api/') && request.method === 'GET') {
      const paramsObject: Record<string, string> = {};
      for (let [key, value] of request.params['map'] as Map<
        string,
        Array<string>
      >) {
        const paramValues = value.filter((item) => item !== 'undefined');
        paramValues.forEach((i) => {
          paramsObject[key] = i;
        });
      }
      const reqClone = request.clone({
        params: new HttpParams({
          fromObject: paramsObject
        }),
      });
      return next.handle(reqClone);
    }
    return next.handle(request);
  }
}
