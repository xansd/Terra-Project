import { Injectable } from '@angular/core';
import { NotificationAdapter } from '../infraestructure/notifier.adapter';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private notifier: NotificationAdapter) {}

  handleError(error: Error) {
    // Aquí puedes manejar diferentes tipos de errores y mostrar mensajes de notificación apropiados
    this.notifier.showNotification('warning', error.message);
  }
}
