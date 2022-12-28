import {
  HttpHandlerFn, HttpInterceptorFn, HttpRequest
} from '@angular/common/http';
import { injectAppConfig } from '../../config/config.di';

export const apiPrefixInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  const appConfig = injectAppConfig();
  if (!req.url.includes('http')) {
    const reqClone = req.clone({
      url: `${appConfig.apiUrl}/${req.url}`,
    });
    return next(reqClone);
  }
  return next(req);
};
