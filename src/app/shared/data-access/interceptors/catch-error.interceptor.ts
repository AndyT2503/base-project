import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CatchErrorInterceptor implements HttpInterceptor {
  private readonly nzMessage = inject(NzMessageService);
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err instanceof HttpErrorResponse) {
            if (
              err.status !== HttpStatusCode.Unauthorized ||
              req.url.includes('login')
            ) {
              this.nzMessage.error(
                err.error?.detail || 'Some internal server error!',
              );
            }
          }
        }
        return throwError(() => err);
      }),
    );
  }
}
