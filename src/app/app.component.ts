import { Component, AfterViewInit } from '@angular/core';
import { AuthenticationService } from './authentication/authentication.service';
import { BrowserTitleService } from './shared/components/browser-title/browser-title.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  skipLinkContent?: string;
  skipLinkNav?: string;
  title = 'raa-client';
  service = 'Analyse Bus Open Data';

  constructor(
    private browserTitleService: BrowserTitleService,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngAfterViewInit() {
    this.browserTitleService.applicationTitle = this.service;
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((navEnd: Event) => {
      const route = (navEnd as NavigationEnd).urlAfterRedirects.split('#')[0];
      this.skipLinkContent = `${route}#content`;
      this.skipLinkNav = `${route}#navigation`;
    });
  }

  get showNav() {
    return this.authService.isSessionAlive;
  }
}
