import { Inject, Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NotificationPort } from '../domain/notifier.port';

@Injectable({
  providedIn: 'root',
})
export class NotificationAdapter implements NotificationPort {
  constructor(@Inject('notifier') private notifier: NotifierService) {}

  showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
  }

  hideOldestNotification(): void {
    this.notifier.hideOldest();
  }

  hideNewestNotification(): void {
    this.notifier.hideNewest();
  }

  hideAllNotifications(): void {
    this.notifier.hideAll();
  }

  showSpecificNotification(type: string, message: string, id: string): void {
    this.notifier.show({
      id,
      message,
      type,
    });
  }

  hideSpecificNotification(id: string): void {
    this.notifier.hide(id);
  }
}
