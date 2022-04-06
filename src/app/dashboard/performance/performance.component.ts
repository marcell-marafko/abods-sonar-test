import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DateTime } from 'luxon';
import { combineLatest } from 'rxjs';
import { Subject, Subscription } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { DateRangeService, Period, WindowDatetimes } from 'src/app/shared/services/date-range.service';
import { RankingOrder, ServicePunctualityType } from 'src/generated/graphql';
import { DashboardService } from '../dashboard.service';
import { PerformanceCategories } from '../dashboard.types';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss'],
})
export class PerformanceComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() nocCode: string | null = null;
  @Input() operators?: { nocCode: string; name?: string | null }[] | null;
  constructor(private service: DashboardService, private dateRange: DateRangeService) {}

  nocCodeSubject = new Subject<string | null>();

  fromTo: WindowDatetimes | null = null;
  fromToSubject = new Subject<WindowDatetimes>();

  subs: Subscription[] = [];

  period: Period = Period.Last28;
  rankingOrderSubject = new Subject<RankingOrder>();
  services: ServicePunctualityType[] = [];

  servicesLoaded = false;

  stats:
    | {
        [key in PerformanceCategories]: number;
      }
    | null = null;
  loaded = false;
  errored = false;

  get hasData() {
    return this.stats !== null;
  }

  ngOnInit(): void {
    this.subs.push(
      combineLatest([this.nocCodeSubject, this.fromToSubject])
        .pipe(
          switchMap(([nocCode, { from, to }]) => this.service.getPunctualityStats(nocCode, from, to)),
          map((stats) => {
            if (stats?.success && !stats?.result?.early && !stats?.result?.late && !stats?.result?.onTime) {
              // To prevent a divide by zero error later
              return { success: true, result: null };
            }
            return stats;
          })
        )
        .subscribe((stats) => {
          this.loaded = true;
          this.errored = !stats?.success;
          this.stats = stats?.result;
        }),
      combineLatest([this.nocCodeSubject, this.fromToSubject, this.rankingOrderSubject])
        .pipe(
          tap(() => (this.servicesLoaded = false)),
          switchMap(([nocCode, { from, to, trendFrom, trendTo }, order]) =>
            this.service.getServiceRanking(nocCode, from, to, order, trendFrom, trendTo)
          )
        )
        .subscribe((rankings) => {
          this.services = (rankings as ServicePunctualityType[]) ?? [];
          this.servicesLoaded = true;
        }),
      this.fromToSubject.pipe(delay(0)).subscribe((fromTo) => (this.fromTo = fromTo))
    );
  }

  ngAfterViewInit(): void {
    this.fromToSubject.next(this.dateRange.calculatePresetPeriod('last28', DateTime.local()));
    this.rankingOrderSubject.next(RankingOrder.Descending);
    this.nocCodeSubject.next(this.nocCode);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nocCode) {
      this.nocCodeSubject.next(changes.nocCode.currentValue as string | null);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub?.unsubscribe());
  }

  changePeriod(event: Event) {
    this.period = ((event.target as HTMLInputElement).value as Period) ?? Period.Last28;

    const now: DateTime = DateTime.local();

    return this.fromToSubject.next(this.dateRange.calculatePresetPeriod(this.period, now));
  }

  changeOrder(order: RankingOrder) {
    this.rankingOrderSubject.next(order);
  }
}
