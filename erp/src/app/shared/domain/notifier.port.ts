export interface NotificationPort {
  showNotification(type: string, message: string): void;
  hideOldestNotification(): void;
  hideNewestNotification(): void;
  hideAllNotifications(): void;
  showSpecificNotification(type: string, message: string, id: string): void;
  hideSpecificNotification(id: string): void;
}
