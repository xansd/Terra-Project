import { Injectable } from '@angular/core';
import { NotificationAdapter } from '../infraestructure/notifier.adapter';
import { SignoutUseCase } from 'src/app/auth/application/use-cases/signout.use-case';
import { Router } from '@angular/router';
import { PageRoutes } from 'src/app/ui/pages/pages-info.config';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(
    private notifier: NotificationAdapter,
    private signOutService: SignoutUseCase,
    private router: Router
  ) {}

  handleUnkonwError(error: Error) {
    console.error(error);
    // Aquí puedes manejar diferentes tipos de errores y mostrar mensajes de notificación apropiados
    this.notifier.showNotification('warning', error.message);
  }

  handleAPIKnowError(response: {
    statusCode: number;
    message: string;
    status?: string;
  }) {
    const { statusCode, message } = response;
    const notificationMessage = `[${statusCode}] ${message}`;
    console.error(response);
    switch (statusCode) {
      case 401:
      case 403:
        this.notifier.showNotification('error', notificationMessage);
        this.signOutService.signout();
        this.router.navigate([PageRoutes.LOGIN]);
        break;
      case 499:
        this.notifier.showNotification('error', notificationMessage);
        this.router.navigate([PageRoutes.RESET_PASSWORD]);
        break;
      default:
        this.notifier.showNotification('error', notificationMessage);
        break;
    }
  }

  handleDomainError(error: Error) {
    console.error(error);
    this.notifier.showNotification('error', `${error.message}`);
  }
}
