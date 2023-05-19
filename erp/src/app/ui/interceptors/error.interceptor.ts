import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { SignoutUseCase } from 'src/app/auth/application/use-cases/signout.use-case';
import { Router } from '@angular/router';
import { PageRoutes } from '../pages/pages-info.config';

export interface IValidationError {
  [key: string]: {
    type: string;
    msg: string;
    path: string;
    location: string;
  };
}

export interface HttpError {
  status: string;
  statusCode: number;
  message: string;
  stack?: string;
  validationData?: IValidationError;
}

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
      tap((event: HttpEvent<any>) => {
        // CUSTOM ERRORS
        if (event instanceof HttpResponse) {
          if (event.body.statusCode) {
            const customError: HttpError = {
              status: event.body.status,
              statusCode: event.body.statusCode,
              message: event.body.message,
            };
            throw customError;
          }
        }
      }),
      catchError((error: any) => {
        // Error no controlado, se maneja aquí
        if ([500, 0].indexOf(error.status) !== -1) {
          this.notifier.showNotification(
            'error',
            `${error.status} - ${error.message}`
          );
        } else if (
          error.status >= 400 &&
          error.status < 500 &&
          error.status !== 401 &&
          error.status !== 403 &&
          error.status !== 499
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
        } else if ([499].indexOf(error.status) !== -1) {
          this.notifier.showNotification(
            'warning',
            `${error.error.error.status_code} - ${error.error.error.status}`
          );
          this.router.navigate([PageRoutes.RESET_PASSWORD]);
          console.log(error.error);
        } else if (error.statusCode) {
          this.notifier.showNotification(
            'error',
            `${error.statusCode} - ${error.message}`
          );
        } else {
          this.notifier.showNotification('error', `Error desconocido`);
        }
        return throwError(() => error);
      })
    );
  }
}
