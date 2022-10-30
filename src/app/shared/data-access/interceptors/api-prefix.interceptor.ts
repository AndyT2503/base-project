import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const env = environment;

export class ApiPrefixInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('http')) {
      const reqClone = req.clone({
        url: `${env.apiUrl}/${req.url}`,
      });
      return next.handle(reqClone);
    }
    return next.handle(req);
  }
}
