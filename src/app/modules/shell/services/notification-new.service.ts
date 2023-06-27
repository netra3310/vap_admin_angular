import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationNewService {
  private notifications = new BehaviorSubject<string[]>([]);

  getNotifications() {
    return this.notifications.asObservable();
  }

  addNotification(message: string) {
    const currentNotifications = this.notifications.getValue();
    currentNotifications.push(message);
    this.notifications.next(currentNotifications);
  }

  clearNotifications() {
    this.notifications.next([]);
  }
}