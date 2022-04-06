import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserFragment } from 'src/generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedUserService {
  isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  userSubject = new ReplaySubject<UserFragment | null>(1);

  get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get authenticatedUser(): Observable<UserFragment> {
    return this.userSubject.pipe(
      filter((u) => u !== null),
      map((u) => u as UserFragment)
    );
  }
}
