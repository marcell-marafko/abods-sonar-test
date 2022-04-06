import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { ConfigService } from './config/config.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationModule } from './authentication/authentication.module';
import { HomeComponent } from './home/home.component';
import { PercentPipe, ViewportScroller } from '@angular/common';
import { Router, Event, Scroll, NavigationEnd } from '@angular/router';
import { debounceTime, filter, pairwise, skipWhile } from 'rxjs/operators';
import { UserModule } from './user/user.module';
import { HttpLinkModule } from 'apollo-angular-link-http';

import { NotFoundComponent } from './not-found/not-found.component';
import { NotAuthorisedComponent } from './not-authorised/not-authorised.component';
import { AnalyticsService } from './analytics.service';
import { MAPBOX_API_KEY, NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { AuthenticatedUserService } from './authentication/authenticated-user.service';

function appLoadFactory(config: ConfigService) {
  return () => config.loadConfig().toPromise();
}

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, NotAuthorisedComponent],
  imports: [
    BrowserModule,
    SharedModule,
    LayoutModule,
    GraphQLModule,
    HttpLinkModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationModule,
    UserModule,
    AppRoutingModule,
    NgxMapboxGLModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appLoadFactory,
      deps: [ConfigService],
      multi: true,
    },
    {
      provide: MAPBOX_API_KEY,
      useFactory: (config: ConfigService) => config.mapboxToken,
      deps: [ConfigService],
    },
    PercentPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private router: Router,
    private analytics: AnalyticsService,
    private viewportScroller: ViewportScroller,
    private userService: AuthenticatedUserService
  ) {
    this.handlePushPageViewOnNavigationEnd();
    this.handleScrollOnNavigation();

    this.userService.authenticatedUser
      .pipe(skipWhile((user) => !user))
      .subscribe((user) => analytics.pushUserInfo(user));
  }

  private handlePushPageViewOnNavigationEnd(): void {
    this.router.events
      .pipe(
        filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd),
        // Allow page rendering to go head so we get the right page title
        // and see if the page itself needs to redirect, ala /on-time -> /on-time/OPCODE
        debounceTime(100)
      )
      .subscribe((e: NavigationEnd) => {
        // `urlAfterRedirects` will contain the final url, not the one the user came in on
        // e.g. `/dashboard` rather than `/`.
        this.analytics.pushPageView(e.urlAfterRedirects);
      });
  }

  /**
   * When route is changed, Angular interprets a simple query params change as "forward navigation" too.
   * Using the pairwise function allows us to have both the previous and current router events, which we can
   * use to effectively compare the two navigation events and see if they actually change route, or only
   * the route parameters (i.e. selections stored in query params).
   *
   * Related to: https://github.com/angular/angular/issues/26744
   */
  private handleScrollOnNavigation(): void {
    this.router.events
      .pipe(
        // import { Event } from '@angular/router'
        filter((e: Event): e is Scroll => e instanceof Scroll),
        pairwise()
      )
      .subscribe((e: Scroll[]) => {
        const previous = e[0];
        const current = e[1];
        if (current.position) {
          // Backward navigation
          this.viewportScroller.scrollToPosition(current.position);
        } else if (current.anchor) {
          // Anchor navigation
          this.viewportScroller.scrollToAnchor(current.anchor);
        } else {
          // Check if routes match, or if it is only a query param change
          if (
            this.getBaseRoute(previous.routerEvent.urlAfterRedirects) !==
            this.getBaseRoute(current.routerEvent.urlAfterRedirects)
          ) {
            // Routes don't match, this is actual forward navigation
            // Default behavior: scroll to top
            this.viewportScroller.scrollToPosition([0, 0]);
          }
        }
      });
  }

  private getBaseRoute(url: string): string {
    // return url without query params
    return url.split('?')[0];
  }
}
