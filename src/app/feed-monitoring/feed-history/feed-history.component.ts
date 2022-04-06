import { ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { combineLatest, of, Subject, Subscription } from 'rxjs';
import { catchError, delay, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { OperatorFeedHistoryFragment, VehicleStatsType } from 'src/generated/graphql';
import { AlertListViewModel, AlertMode, AlertType } from '../alert-list/alert-list-view-model';
import { EventStats, FeedMonitoringService } from '../feed-monitoring.service';
import { IHeatmap } from './datenav/datenav.component';
import { nonNullishArray } from '../../on-time/transit-model.service';

@Component({
  selector: 'app-history',
  templateUrl: './feed-history.component.html',
  styleUrls: ['./feed-history.component.scss'],
})
export class FeedHistoryComponent implements OnInit, OnDestroy {
  constructor(
    private fmService: FeedMonitoringService,
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private change: ChangeDetectorRef
  ) {}
  private subs: Subscription[] = [];

  loading = true;
  chartErrored = false;
  notFound = false;
  noData = false;

  operator: OperatorFeedHistoryFragment | null = null;
  allOperators?: { name?: string | null; nocCode: string }[];

  date?: DateTime;

  nocCode: string | null = null;
  nocCodeSubject = new Subject<string>();
  dateSubject = new Subject<DateTime>();

  alertStats?: IHeatmap[];
  alertMode = AlertMode;
  selectedAlert = new Subject<string | null>();

  vehicleStats?: VehicleStatsType[];

  alerts: { timestamp: DateTime; type: AlertType; id: string }[] = [];

  ngOnInit() {
    this.subs.push(
      this.fmService.listOperators.subscribe((l) => (this.allOperators = l)),
      this.nocCodeSubject
        .pipe(
          tap((nocCode) => (this.nocCode = nocCode)),
          switchMap((nocCode) => this.fmService.fetchAlertStats(nocCode, DateTime.local().minus({ day: 1 }))),
          map((data) => this.cleanUpAlertStats(data))
        )
        .subscribe((stats) => (this.alertStats = stats)),

      combineLatest([this.nocCodeSubject, this.dateSubject])
        .pipe(
          filter(([nocCode, date]) => !!nocCode && !!date),
          tap(() => {
            this.chartErrored = false;
            this.notFound = false;
            this.noData = false;
            this.loading = true;
          }),
          switchMap(([nocCode, date]) => this.fmService.fetchOperatorHistory(nocCode, date)),
          catchError(() => {
            this.chartErrored = true;
            this.loading = false;
            return of(null);
          })
        )
        .subscribe((operator) => {
          this.loading = false;
          this.operator = operator;

          if (!operator) {
            this.notFound = true;
          } else if (operator.feedMonitoring.vehicleStats?.length > 0) {
            this.chartErrored = false;
            this.vehicleStats = nonNullishArray(operator.feedMonitoring.vehicleStats);
          } else {
            this.noData = true;
          }
        }),
      this.route.paramMap
        .pipe(
          filter((pm) => pm.has('nocCode')),
          map((pm) => pm.get('nocCode') as string),
          distinctUntilChanged()
        )
        .subscribe((nocCode) => {
          this.nocCodeSubject.next(nocCode);
        }),
      this.route.queryParamMap
        .pipe(
          tap((qpm) => {
            if (!qpm.has('date')) {
              this.router.navigate(['.'], {
                relativeTo: this.route,
                queryParams: { date: DateTime.local().minus({ day: 1 }).toFormat('yyyy-MM-dd') },
                replaceUrl: true,
                queryParamsHandling: 'merge',
              });
            }
          }),
          filter((qpm) => qpm.has('date')),
          map((qpm) => DateTime.fromISO(qpm.get('date') as string, { zone: 'utc' })),
          distinctUntilChanged(),
          tap((date) => (this.date = date))
        )
        .subscribe((date) => {
          this.dateSubject.next(date);
        }),
      this.selectedAlert
        .pipe(
          filter((alert) => alert !== null),
          delay(5000)
        )
        .subscribe(() => this.selectedAlert.next(null))
    );
  }

  private cleanUpAlertStats(stats: EventStats[]): { heat: number; date: DateTime }[] {
    const max: number = Math.max(...stats.map(({ count }) => count ?? 0));

    return stats.map(({ count, day }) => ({
      heat: count ? Math.ceil((count / max) * 6) : 0,
      date: DateTime.fromISO(day, { zone: 'utc' }),
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub?.unsubscribe());
  }

  changeOperator({ nocCode }: { nocCode: string }) {
    this.router.navigate(['/', 'feed-monitoring', nocCode, 'feed-history']);
  }

  changeDate(date: DateTime) {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { date: date.toISODate() },
      queryParamsHandling: 'merge',
    });
  }

  formatUpdateFrequency(f?: number) {
    return f ? `${f}s` : '-';
  }

  formatAvailability(f?: number) {
    return `${f}%`;
  }

  newAlerts(alerts: AlertListViewModel[]) {
    this.alerts = alerts ?? [];
  }

  alertSelected(id: string) {
    this.selectedAlert.next(id);
    // this will be called from outside the angular zone (in amCharts) so manually invoke change detection:
    this.change.detectChanges();
    this.viewportScroller.scrollToAnchor(id);
  }
}
