import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { OnTimeService } from './on-time.service';
import { map, shareReplay } from 'rxjs/operators';
import { defer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SingleOperatorGuardService implements CanActivate {
  constructor(private onTimeService: OnTimeService, private router: Router) {}

  // TODO push this out to a shared service
  private operators = defer(() => this.onTimeService.listOperators).pipe(shareReplay(1));

  canActivate() {
    return this.operators.pipe(
      map((list) => (list.length === 1 ? this.router.createUrlTree(['on-time', list[0].nocCode]) : true))
    );
  }
}
