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
      const paramsObject: Record<string, string | string[]> = {};
      for (let [key, value] of request.params['map'] as Map<
        string,
        Array<string>
      >) {
        const paramValues = value.filter((item) => item !== 'undefined' && item !== 'null');
        if (paramValues.length > 1) {
          paramsObject[key] = paramValues;
        } else {
          paramsObject[key] = paramValues[0];
        }
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
