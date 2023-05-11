import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { SignoutUseCase } from 'src/app/auth/application/use-cases/signout.use-case';
import { Router } from '@angular/router';
import { PageRoutes } from '../pages/pages-info.config';
@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {
  constructor(
    private signOutService: SignoutUseCase,
    private notifier: NotificationAdapter,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      map((res) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        if ([500, 0].indexOf(error.status) !== -1) {
          this.notifier.showNotification(
            'error',
            `${error.status} - ${error.message}`
          );
        } else if (
          error.status >= 400 &&
          error.status < 500 &&
          error.status !== 401 &&
          error.status !== 403
        ) {
          this.notifier.showNotification(
            'error',
            `${error.error.error.status_code} - ${error.error.error.status}`
          );
          console.log(error);
        } else if ([401, 403].indexOf(error.status) !== -1) {
          this.notifier.showNotification(
            'error',
            `${error.error.error.status_code} - ${error.error.error.status}`
          );
          this.signOutService.signout();
          this.router.navigate([PageRoutes.LOGIN]);
          console.log(error.error);
        } else {
          this.notifier.showNotification(
            'error',
            `${error.error.error.status_code} - ${error.error.error.status}`
          );
          console.log(error.error);
        }
        return throwError(() => error);
      })
    );
  }
}
