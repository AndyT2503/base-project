import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const catchErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  const nzModal = inject(NzModalService);
  return next(req).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        if (
          err.status !== HttpStatusCode.Unauthorized ||
          req.url.includes('login')
        ) {
          nzModal.error({
            nzTitle: 'Error',
            nzContent: err.error?.detail || 'Some internal server error!',
          });
        }
      }
      return throwError(() => err);
    }),
  );
};
