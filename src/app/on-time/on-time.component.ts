import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {
  DayOfWeekFlagsInputType,
  FrequentServiceInfoType,
  PerformanceFiltersInputType,
  ServiceInfoType,
} from 'src/generated/graphql';
import { PanelComponent } from '../shared/components/panel/panel.component';
import { FiltersComponent } from './filters/filters.component';
import { OnTimeService, PerformanceParams, PunctualityOverview } from './on-time.service';
import { nonNullOrUndefined } from '../shared/rxjs-operators';
import { DateRangeService } from '../shared/services/date-range.service';
import { ParamsService } from './params.service';
import { FormControl } from '@angular/forms';
import { filter as _filter, forEach as _forEach } from 'lodash-es';
import { TabsComponent } from '../shared/components/tabs/tabs.component';
import { TabComponent } from '../shared/components/tabs/tab/tab.component';
import { Headway, HeadwayService } from './headway.service';
import { PerformanceService } from './performance.service';

export interface Operator {
  name?: string | null;
  nocCode: string;
}

export enum TimingPointsOption {
  AllStops,
  TimingPointsOnly,
}

@Component({
  templateUrl: 'on-time.component.html',
  styleUrls: ['./on-time.component.scss'],
})
export class OnTimeComponent implements OnInit, AfterViewInit, OnDestroy {
  allOperators: Operator[] = [];
  allOperatorsSubject = new BehaviorSubject<Operator[]>([]);
  operator?: Operator;
  service: ServiceInfoType | null = null;
  nocCode: string | null = null;
  lineId: string | null = null;
  operatorNotFound = false;
  lineNotFound = false;

  filtersSubject = new BehaviorSubject<PerformanceFiltersInputType>({});

  dateRange = new FormControl(this.dateRangeService.calculatePresetPeriod('last28', DateTime.local()));

  onDestroy$ = new Subject();
  afterViewInit$ = new Subject();

  params$!: Observable<PerformanceParams>;

  overview?: PunctualityOverview;
  headwayOverview?: Headway;
  overviewLoading = true;

  frequentServiceInfo?: FrequentServiceInfoType;
  frequentServiceInfoLoading = true;

  TimingPointsOption = TimingPointsOption;
  singleOperator = false;

  overviewMode: 'on-time-performance' | 'excess-wait-time' = 'on-time-performance';

  @ViewChild(PanelComponent) filterPanel?: PanelComponent;
  @ViewChild(FiltersComponent) filtersComponent?: FiltersComponent;
  @ViewChild(TabsComponent) tabs?: TabsComponent;
  @ViewChild('mapTab') mapTab?: TabComponent;

  filtersCount$ = this.filtersSubject.pipe(
    map(({ dayOfWeekFlags, maxDelay, minDelay, startTime, endTime }) => {
      let count = 0;

      _forEach(_filter([dayOfWeekFlags, maxDelay, minDelay, startTime || endTime]), () => count++);

      return count;
    })
  );

  get noData() {
    return !!this.overview && this.overview.completed === 0;
  }

  get dataExpected() {
    return !!this.overview && this.overview.scheduled > 0;
  }

  get timingPointsOnly(): boolean {
    return this.timingPointsOption === TimingPointsOption.TimingPointsOnly;
  }

  get timingPointsOption(): TimingPointsOption {
    if (this.filtersSubject.value.timingPointsOnly) {
      return TimingPointsOption.TimingPointsOnly;
    }
    return TimingPointsOption.AllStops;
  }

  set timingPointsOption(timingPointsOnlyOption: TimingPointsOption) {
    let timingPointsOnly: boolean | null = null;

    switch (timingPointsOnlyOption) {
      case TimingPointsOption.TimingPointsOnly:
        timingPointsOnly = true;
    }

    this.router.navigate([], { queryParams: { timingPointsOnly }, queryParamsHandling: 'merge' });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private onTimeService: OnTimeService,
    private headwayService: HeadwayService,
    private performanceService: PerformanceService,
    private dateRangeService: DateRangeService,
    private paramsService: ParamsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  getPerformanceParams(paramMap: ParamMap, queryParams: ParamMap): PerformanceParams {
    const filters: PerformanceFiltersInputType = {};

    if (paramMap.get('nocCode')) {
      filters.nocCodes = [paramMap.get('nocCode')];
    }
    if (paramMap.get('lineId')) {
      filters.lineIds = [paramMap.get('lineId')];
    }

    let from: DateTime = this.dateRange.value.from;
    if (queryParams.get('from')) {
      from = DateTime.fromFormat(queryParams.get('from') as string, 'yyyy-MM-dd').toLocal();
    }
    let to: DateTime = this.dateRange.value.to;
    if (queryParams.get('to')) {
      to = DateTime.fromFormat(queryParams.get('to') as string, 'yyyy-MM-dd').toLocal();
    }

    if (queryParams.get('dayOfWeek')) {
      const dayOfWeekFlags: DayOfWeekFlagsInputType = {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      };

      queryParams
        .get('dayOfWeek')
        ?.split(',')
        .map((day) => {
          if (day as keyof DayOfWeekFlagsInputType) dayOfWeekFlags[day as keyof DayOfWeekFlagsInputType] = true;
        });

      filters.dayOfWeekFlags = dayOfWeekFlags;
    }

    if (queryParams.get('startTime')) {
      filters.startTime = queryParams.get('startTime');
    }

    if (queryParams.get('endTime')) {
      filters.endTime = queryParams.get('endTime');
    }

    if (queryParams.get('minDelay')) {
      filters.minDelay = parseInt(queryParams.get('minDelay') as string);
    }

    if (queryParams.get('maxDelay')) {
      filters.maxDelay = parseInt(queryParams.get('maxDelay') as string);
    }

    if (queryParams.get('timingPointsOnly')) {
      filters.timingPointsOnly = queryParams.get('timingPointsOnly') === 'true';
    }

    this.filtersSubject.next(filters);

    return {
      fromTimestamp: from.toJSDate(),
      toTimestamp: to.toJSDate(),
      filters,
    };
  }

  ngOnInit(): void {
    // The reference ActiveRoute.firstChild changes when the route updates, so need to listen for navigation events
    const paramMap$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith({}),
      mergeMap(() => this.route.firstChild?.paramMap ?? this.route.paramMap),
      takeUntil(this.onDestroy$),
      shareReplay(1)
    );

    const queryParamMap$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith({}),
      mergeMap(() => this.route.firstChild?.queryParamMap ?? this.route.queryParamMap)
    );

    this.dateRange.valueChanges.subscribe(({ from, to }) =>
      this.router.navigate([], {
        queryParams: { from: from.toFormat('yyyy-MM-dd'), to: to.toFormat('yyyy-MM-dd') },
        queryParamsHandling: 'merge',
      })
    );

    this.params$ = combineLatest([paramMap$, queryParamMap$]).pipe(
      map(([paramMap, queryParamMap]) => this.getPerformanceParams(paramMap, queryParamMap)),
      takeUntil(this.onDestroy$),
      shareReplay(1)
    );
    // Don't subscribe directly to ensure that we don't complete the paramService
    this.params$.subscribe((ps) => this.paramsService.params.next(ps));

    this.params$
      .pipe(
        tap(() => {
          this.overview = undefined;
          this.overviewLoading = true;
        }),
        switchMap((params: PerformanceParams) => this.performanceService.fetchOverviewStats(params))
      )
      .subscribe(({ onTime, headway }) => {
        this.overview = onTime;
        this.headwayOverview = headway;
        this.overviewLoading = false;
      });

    combineLatest([paramMap$, this.allOperatorsSubject])
      .pipe(
        tap(() => (this.operatorNotFound = false)),
        map(([pm, l]): [string | null, Operator[]] => {
          const nocCode = pm.get('nocCode');
          this.nocCode = nocCode;
          return [nocCode, l];
        }),
        filter(([nocCode, l]) => !!nocCode && l.length > 0),
        map(([nocCode, l]) => l.find((operator) => operator.nocCode === nocCode)),
        takeUntil(this.onDestroy$)
      )
      .subscribe((operator) => {
        this.operator = operator;
        if (!operator) {
          this.operatorNotFound = true;
        }
      });

    this.onTimeService.listOperators.subscribe((l) => {
      this.allOperatorsSubject.next(l);
      this.allOperators = l;
      this.singleOperator = l.length === 1;
    });

    paramMap$
      .pipe(
        map((paramMap) => paramMap.get('lineId')),
        tap((lineId) => {
          this.lineId = lineId;
          this.lineNotFound = false;
          this.changeDetectorRef.detectChanges();
        }),
        nonNullOrUndefined(),
        distinctUntilChanged(),
        switchMap((lineId) => this.onTimeService.fetchServiceInfo(lineId)),
        catchError(() => of(null)),
        takeUntil(this.onDestroy$)
      )
      .subscribe((service) => {
        this.service = service;
        if (!service) {
          this.lineNotFound = true;
        }
        this.router.navigate([], { queryParams: { tab: 'map' }, queryParamsHandling: 'merge' });
      });

    this.params$
      .pipe(
        filter((params) => !!params.filters.lineIds?.[0]),
        distinctUntilChanged(),
        tap(() => (this.frequentServiceInfoLoading = true)),
        switchMap((params) => this.headwayService.fetchFrequentServiceInfo(params)),
        tap(() => (this.frequentServiceInfoLoading = false))
      )
      .subscribe((frequentServiceInfo) => {
        this.frequentServiceInfo = frequentServiceInfo;
        if (this.overviewMode === 'excess-wait-time' && frequentServiceInfo.numHours === 0)
          this.overviewMode = 'on-time-performance';
      });

    this.route.queryParamMap
      .pipe(
        filter((paramMap) => paramMap.has('tab')),
        map((paramMap) => paramMap.get('tab') as string)
      )
      .subscribe((tab) => this.tabs?.openTab(tab));

    this.route.queryParamMap
      .pipe(
        filter(
          (paramMap) =>
            (paramMap.has('overview') && paramMap.get('overview') === 'on-time-performance') ||
            paramMap.get('overview') === 'excess-wait-time'
        ),
        map((paramMap) => paramMap.get('overview') as 'on-time-performance' | 'excess-wait-time')
      )
      .subscribe((overviewMode) => (this.overviewMode = overviewMode));

    this.route.queryParamMap
      .pipe(
        filter(
          (paramMap) =>
            paramMap.has('overview') &&
            paramMap.get('overview') !== 'on-time-performance' &&
            paramMap.get('overview') !== 'excess-wait-time'
        )
      )
      .subscribe(() => this.router.navigate([], { queryParams: { overview: null }, queryParamsHandling: 'merge' }));
  }

  ngAfterViewInit(): void {
    this.afterViewInit$.next();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  changeOperator(operator: { name?: string | null; nocCode: string }) {
    this.router.navigate(['/on-time', operator.nocCode]);
  }

  updateFilters(value: PerformanceFiltersInputType) {
    this.router.navigate([], {
      queryParams: {
        dayOfWeek: value.dayOfWeekFlags
          ? Object.entries(value.dayOfWeekFlags)
              .filter(([_s, v]) => v)
              .map(([s, _v]) => s)
              .join()
          : undefined,
        startTime: value.startTime,
        endTime: value.endTime,
        minDelay: value.minDelay,
        maxDelay: value.maxDelay,
      },
      queryParamsHandling: 'merge',
    });
  }

  resetFilters() {
    this.filtersComponent?.resetFilters();
  }

  tabChanged(tab: TabComponent) {
    this.router.navigate([], { queryParams: { tab: tab.id }, queryParamsHandling: 'merge' });
  }

  overviewModeChanged(overview: string) {
    this.router.navigate([], { queryParams: { overview }, queryParamsHandling: 'merge' });
  }
}
