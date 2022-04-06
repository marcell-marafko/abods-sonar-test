import { Component, Input } from '@angular/core';

@Component({
  selector: 'gds-notification-banner',
  templateUrl: './notification-banner.component.html',
})
export class NotificationBannerComponent {
  @Input() title!: string;
  @Input() success?: boolean = false;
  @Input() identifier!: string;
}
