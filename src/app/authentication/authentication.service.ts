import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, first, map, switchMap } from 'rxjs/operators';
import { UserGQL, LoginGQL, LogoutGQL } from 'src/generated/graphql';
import { AuthenticatedUserService } from './authenticated-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private apollo: Apollo,
    private loginMutation: LoginGQL,
    private logoutMutation: LogoutGQL,
    private userQuery: UserGQL,
    private router: Router,
    private userService: AuthenticatedUserService
  ) {
    this.userService.isAuthenticatedSubject
      .pipe(
        distinctUntilChanged(),
        switchMap((isAuth) => {
          if (isAuth) {
            return this.userQuery.fetch().pipe(map((u) => u.data?.user ?? null));
          } else {
            return of(null);
          }
        })
      )
      .subscribe(this.userService.userSubject);

    this.checkSession();
  }

  login(username: string, password: string) {
    return this.loginMutation
      .mutate({ username, password })
      .pipe(first())
      .subscribe((res) => {
        this.userService.isAuthenticatedSubject.next(res?.data?.login.success ?? false);
        if (res?.data?.login.success) {
          this.setSession(
            JSON.stringify({
              expiresAt: res.data.login.expiresAt,
            })
          );
        } else {
          this.clearSession();
        }
      });
  }

  logout() {
    this.logoutMutation
      .mutate()
      .pipe(first())
      .subscribe(({ data }) => {
        if (data?.logout) {
          this.userService.isAuthenticatedSubject.next(false);
        } else {
          console.error('Logout failed!');
        }
      });
    this.apollo.client.resetStore();
    this.userService.isAuthenticatedSubject.next(false);
    this.clearSession();
    this.router.navigate(['/login']);
  }

  get isAuthenticated(): Observable<boolean> {
    return this.userService.isAuthenticatedSubject.asObservable();
  }

  get isSessionAlive(): boolean {
    const storage = this.getSession();
    if (!storage) {
      return false;
    }
    const session = JSON.parse(storage);
    const now = new Date();
    if (now.getTime() > session.expiresAt) {
      this.clearSession();
      this.userService.isAuthenticatedSubject.next(false);
      return false;
    }
    return true;
  }

  checkSession() {
    this.userService.isAuthenticatedSubject.next(this.isSessionAlive);
  }

  setSession(session: string) {
    localStorage.setItem('session', session);
  }

  getSession() {
    return localStorage.getItem('session');
  }

  clearSession() {
    localStorage.removeItem('session');
  }
}
