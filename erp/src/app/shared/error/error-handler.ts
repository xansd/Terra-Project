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
    // Aquí puedes manejar diferentes tipos de errores y mostrar mensajes de notificación apropiados
    this.notifier.showNotification('warning', error.message);
  }

  handleAPIKnowError(response: {
    statusCode: number;
    message: string;
    status?: string;
  }) {
    if (response.statusCode === 401 || response.statusCode === 403) {
      this.signOutService.signout();
      this.router.navigate([PageRoutes.LOGIN]);
    }

    // Aquí puedes manejar diferentes tipos de errores y mostrar mensajes de notificación apropiados
    this.notifier.showNotification(
      'error',
      `[${response.statusCode}] ${response.message}`
    );
  }

  handleDomainError(error: Error) {
    this.notifier.showNotification('error', `${error.message}`);
  }
}
