import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { of, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { Granularity, OperatorLiveStatusFragment } from 'src/generated/graphql';
import { AlertMode } from '../alert-list/alert-list-view-model';
import { FeedMonitoringService } from '../feed-monitoring.service';

@Component({
  selector: 'app-live-status',
  templateUrl: './live-status.component.html',
  styleUrls: ['./live-status.component.scss'],
})
export class LiveStatusComponent implements OnInit, OnDestroy {
  constructor(private fmService: FeedMonitoringService, private route: ActivatedRoute, private router: Router) {}
  private subs: Subscription[] = [];

  nocCode: string | null = null;

  operator?: OperatorLiveStatusFragment;
  allOperators?: { name?: string | null; nocCode: string }[];
  lastCheck?: DateTime;

  hour = Granularity.Hour;
  minute = Granularity.Minute;

  alertMode = AlertMode;

  chartsLoading = true;
  notFound = false;
  operatorLoading = true;
  chartsErrored = false;

  ngOnInit(): void {
    this.subs.push(
      this.fmService.listOperators.subscribe((l) => (this.allOperators = l)),
      this.route.paramMap
        .pipe(
          map((pm) => pm.get('nocCode')),
          filter((nocCode) => !!nocCode),
          distinctUntilChanged(),
          tap((nocCode) => {
            this.nocCode = nocCode;
            this.operatorLoading = true;
            this.notFound = false;
            this.chartsErrored = false;
          }),
          switchMap((nocCode) => {
            return this.fmService.fetchOperator(nocCode as string);
          }),
          catchError(() => {
            this.chartsErrored = true;
            return of(null);
          })
        )
        .subscribe((operator) => {
          if (operator) {
            this.chartsLoading = false;
            this.operatorLoading = false;
            this.operator = operator;
            this.lastCheck = DateTime.local();
          } else {
            this.notFound = true;
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub?.unsubscribe());
  }

  formatUpdateFrequency(f?: number) {
    return f ? `${f}s` : '-';
  }

  changeOperator({ nocCode }: { nocCode: string }) {
    this.router.navigate([nocCode], { relativeTo: this.route.parent });
  }
}
