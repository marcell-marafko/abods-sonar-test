import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../../authentication/authentication.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() service?: string;

  constructor(private authService: AuthenticationService) {}

  hasSession() {
    return this.authService.isSessionAlive;
  }
}
