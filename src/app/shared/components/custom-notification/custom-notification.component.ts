import { Component, OnInit } from '@angular/core';
import { NotificationNewService } from 'src/app/modules/shell/services/notification-new.service';

@Component({
  selector: 'app-custom-notification',
  templateUrl: './custom-notification.component.html',
  styleUrls: ['./custom-notification.component.scss']
})
export class CustomNotificationComponent implements OnInit {


  ngOnInit(): void {
  }
  
  notifications: string[] = [];

  constructor(private notificationService: NotificationNewService) {
    notificationService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
    });
  }

  addNotification() {
    this.notificationService.addNotification('New Notification');
  }

  clearNotifications() {
    this.notificationService.clearNotifications();
  }

}

