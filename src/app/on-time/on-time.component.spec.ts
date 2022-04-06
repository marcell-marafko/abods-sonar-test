import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { byLabel, byRole, byText, createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { DateTime } from 'luxon';
import { PerformanceFiltersInputType } from 'src/generated/graphql';
import { dateTimeEqualityMatcher } from 'src/test-support/equality';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../shared/shared.module';
import { FiltersComponent } from './filters/filters.component';
import { OnTimeComponent } from './on-time.component';
import { OnTimeService, PunctualityOverview } from './on-time.service';
import { of, throwError } from 'rxjs';
import { ChartNoDataWrapperComponent } from './chart-no-data-wrapper/chart-no-data-wrapper.component';
import { MockProvider } from 'ng-mocks';
import { HeadwayService } from './headway.service';

describe('OnTimeComponent', () => {
  let spectator: SpectatorRouting<OnTimeComponent>;
  let component: OnTimeComponent;
  let onTimeService: OnTimeService;
  let headwayService: HeadwayService;

  const createComponent = createRoutingFactory({
    component: OnTimeComponent,
    declarations: [FiltersComponent, ChartNoDataWrapperComponent],
    imports: [LayoutModule, SharedModule, FormsModule, ReactiveFormsModule, ApolloTestingModule],
    providers: [
      MockProvider(OnTimeService, {
        fetchOnTimeStats: () => throwError(true),
      }),
    ],
    detectChanges: false,
    stubsEnabled: false,
  });

  beforeEach(() => {
    jasmine.addCustomEqualityTester(dateTimeEqualityMatcher);
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    onTimeService = spectator.inject(OnTimeService);
    headwayService = spectator.inject(HeadwayService);

    spyOnProperty(onTimeService, 'listOperators').and.returnValue(of([{ nocCode: 'OP01', name: 'Operator 1' }]));
  });

  it('should create', () => {
    spectator.setRouteParam('nocCode', 'OP01');

    expect(component).toBeTruthy();
  });

  it('should not show operator selector on operator list page', () => {
    expect(spectator.query(byRole('combobox'))).not.toBeVisible();
  });

  it('should show operator selector on service list page', () => {
    spectator.setRouteParam('nocCode', 'OP01');
    spectator.detectChanges();

    expect(spectator.query(byRole('combobox'))).toBeVisible();
    expect(spectator.query(byText('Operator 1 (OP01)'))).toBeVisible();
  });

  it('should default to "all stops"', () => {
    let filters: PerformanceFiltersInputType | undefined;

    component.filtersSubject.subscribe((f) => (filters = f));

    spectator.setRouteParam('nocCode', 'OP01');

    expect(filters).toBeDefined();
    expect(filters?.timingPointsOnly).not.toBeDefined(); // Null means all stops, false means 'Not timing points'
  });

  it('should allow you to switch between all stops and timing points only', async () => {
    spyOn(spectator.router, 'navigate');
    spectator.setRouteParam('nocCode', 'OP01');

    spectator.click(byText('Timing points'));
    spectator.detectChanges();

    expect(spectator.router.navigate).toHaveBeenCalledWith([], {
      queryParams: { timingPointsOnly: true },
      queryParamsHandling: 'merge',
    });
  });

  it('it should apply timing points filter from query string', (done) => {
    spectator.setRouteParam('nocCode', 'OP01');

    spectator.setRouteQueryParam('timingPointsOnly', 'true');

    component.params$.subscribe((params) => {
      expect(params).toEqual(
        jasmine.objectContaining({
          filters: jasmine.objectContaining({
            timingPointsOnly: true,
          }),
        })
      );
      done();
    });
    spectator.detectChanges();
  });

  it('should allow you to open the more filters panel', () => {
    spectator.setRouteParam('nocCode', 'OP01');

    const filters = spectator.query('.panel');

    expect(filters).not.toHaveClass('panel---open');

    spectator.click(byText('More filters'));

    expect(filters).toHaveClass('panel--open');

    spectator.click(byText('More filters'));
    spectator.detectChanges();

    expect(filters).not.toHaveClass('panel--open');
  });

  it('should show the number of more filters applied', () => {
    spectator.setRouteParam('nocCode', 'OP01');

    spectator.setRouteQueryParam('dayOfWeek', 'monday,tuesday');

    spectator.setRouteQueryParam('startTime', '07:00');
    spectator.setRouteQueryParam('endTime', '10:59');

    spectator.detectChanges();

    expect(spectator.query(byText('Filters (2)'))).toBeTruthy();
  });

  it('should apply more filters correctly to query string', () => {
    spyOn(spectator.router, 'navigate');

    spectator.setRouteParam('nocCode', 'OP01');

    spectator.click(byText('More filters'));

    spectator.click(byLabel('Mon'));
    spectator.click(byLabel('Tue'));

    spectator.typeInElement('07', byLabel('Start time'));
    spectator.typeInElement('10', byLabel('End time'));

    spectator.detectChanges();

    spectator.click(byText('Apply filter'));
    spectator.detectChanges();

    expect(spectator.router.navigate).toHaveBeenCalledWith([], {
      queryParams: jasmine.objectContaining({
        dayOfWeek: 'wednesday,thursday,friday,saturday,sunday',
        startTime: '07:00',
        endTime: '10:59',
      }),
      queryParamsHandling: 'merge',
    });
  });

  it('should apply more filters correctly from query string', (done) => {
    spectator.setRouteParam('nocCode', 'OP01');

    spectator.setRouteQueryParam('dayOfWeek', 'wednesday,thursday,friday,saturday,sunday');

    spectator.setRouteQueryParam('startTime', '07:00');
    spectator.setRouteQueryParam('endTime', '10:59');

    component.params$.subscribe((params) => {
      expect(params).toEqual(
        jasmine.objectContaining({
          filters: jasmine.objectContaining({
            dayOfWeekFlags: {
              monday: false,
              tuesday: false,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: true,
              sunday: true,
            },
            startTime: '07:00',
            endTime: '10:59',
          }),
        })
      );
      done();
    });
    spectator.detectChanges();
  });

  it('should not show operator not found message if operator exists', () => {
    spectator.setRouteParam('nocCode', 'OP01');

    expect(spectator.query(byText(/Not found/))).not.toBeVisible();
  });

  it('should show operator not found message', () => {
    spectator.setRouteParam('nocCode', 'OP02');

    expect(spectator.query(byText(/Not found/))).toBeVisible();
  });

  it('should show line not found message', () => {
    spyOn(onTimeService, 'fetchServiceInfo').and.returnValue(throwError({}));

    spectator.setRouteParam('nocCode', 'OP01');
    spectator.setRouteParam('lineId', 'LN12345');

    expect(spectator.query(byText(/Not found/))).toBeTruthy();
  });

  it('should show line data where a lineId is specified', (done) => {
    const spy = spyOn(onTimeService, 'fetchServiceInfo').and.returnValue(
      of({ serviceName: 'Sheffield to Mansfield', serviceNumber: '53', serviceId: 'XYZ' })
    );

    spectator.setRouteParam('nocCode', 'OP01');

    spectator.setRouteParam('lineId', 'LN12345');

    // Need to set non-null from and to dates to make the params$ subject emit
    component.dateRange.setValue({
      from: DateTime.fromISO('2021-01-01T00:00:00'),
      to: DateTime.fromISO('2021-02-01T00:00:00'),
    });

    expect(spy).toHaveBeenCalledWith('LN12345');
    expect(spectator.query(byText('53 - Sheffield to Mansfield'))).toExist();

    component.params$.subscribe((params) => {
      expect(params).toEqual(jasmine.objectContaining({ filters: { nocCodes: ['OP01'], lineIds: ['LN12345'] } }));
      done();
    });
  });

  it('should request stats for dates and nocCode', (done) => {
    const nocCode = 'OP01';

    const from = DateTime.fromObject({ year: 2021, month: 3, day: 30 });
    const to = DateTime.fromObject({ year: 2021, month: 4, day: 4 });

    const onTimeInputParams = {
      fromTimestamp: from.toJSDate(),
      toTimestamp: to.toJSDate(),
      filters: {
        nocCodes: [nocCode],
      },
    };

    spectator.setRouteParam('nocCode', nocCode);

    spectator.setRouteQueryParam('from', from.toFormat('yyyy-MM-dd'));
    spectator.setRouteQueryParam('to', to.toFormat('yyyy-MM-dd'));

    // Need to set non-null from and to dates to make the params$ subject emit

    spectator.detectChanges();

    component.params$.subscribe((params) => {
      expect(params).toEqual(jasmine.objectContaining(onTimeInputParams));
      done();
    });
  });

  it('should display no timetabled error message', () => {
    spyOn(onTimeService, 'fetchOnTimeStats').and.returnValue(
      of({
        completed: 0,
        scheduled: 0,
      } as PunctualityOverview)
    );

    const nocCode = 'OP01';

    spectator.setRouteParam('nocCode', nocCode);

    spectator.detectChanges();

    expect(
      spectator.query(byText(/We have not found any timetable data for the time period and filters selected\./))
    ).toBeVisible();
  });

  it('should display no data error message', () => {
    spyOn(onTimeService, 'fetchOnTimeStats').and.returnValue(
      of({
        completed: 0,
        scheduled: 100,
      } as PunctualityOverview)
    );

    const nocCode = 'OP01';

    spectator.setRouteParam('nocCode', nocCode);

    spectator.detectChanges();

    expect(
      spectator.query(
        byText(/We have not received any vehicle location data for the time period and filters selected\./)
      )
    ).toBeVisible();
  });

  it('should not show mode selector for services that do not run frequently', async () => {
    spyOn(onTimeService, 'fetchServiceInfo').and.returnValue(
      of({ serviceName: 'Sheffield to Mansfield', serviceNumber: '53', serviceId: 'XYZ' })
    );

    const spy = spyOn(headwayService, 'fetchFrequentServiceInfo').and.returnValue(of({ numHours: 0, totalHours: 100 }));

    spectator.setRouteParam('nocCode', 'OP01');
    spectator.setRouteParam('lineId', 'LN12345');

    // Need to set non-null from and to dates to make the params$ subject emit
    component.dateRange.setValue({
      from: DateTime.fromISO('2021-01-01T00:00:00'),
      to: DateTime.fromISO('2021-02-01T00:00:00'),
    });

    spectator.click(byText('Timeline'));
    spectator.detectChanges();

    await spectator.fixture.whenStable();

    expect(spy).toHaveBeenCalled();
    expect(spectator.query(byLabel('Show:'))).not.toBeVisible();
    expect(
      spectator.query(
        byText(
          '0 hours out of a total 100 service hours during the selected period operated on a frequent service basis. Excess Waiting Time is averaged over the period in which the service is running on a frequent basis.'
        )
      )
    ).not.toBeVisible();
  });

  it('should show mode selector for services that do run frequently', async () => {
    spyOn(onTimeService, 'fetchServiceInfo').and.returnValue(
      of({ serviceName: 'Sheffield to Mansfield', serviceNumber: '53', serviceId: 'XYZ' })
    );

    const spy = spyOn(headwayService, 'fetchFrequentServiceInfo').and.returnValue(
      of({ numHours: 50, totalHours: 100 })
    );

    spectator.setRouteParam('nocCode', 'OP01');

    spectator.setRouteParam('lineId', 'LN12345');

    // Need to set non-null from and to dates to make the params$ subject emit
    component.dateRange.setValue({
      from: DateTime.fromISO('2021-01-01T00:00:00'),
      to: DateTime.fromISO('2021-02-01T00:00:00'),
    });

    spectator.click(byText('Timeline'));
    spectator.detectChanges();

    await spectator.fixture.whenStable();

    expect(spy).toHaveBeenCalled();
    expect(spectator.query(byLabel('Show:'))).toBeVisible();
  });

  it('should show summary of frequent service', async () => {
    spyOn(onTimeService, 'fetchServiceInfo').and.returnValue(
      of({ serviceName: 'Sheffield to Mansfield', serviceNumber: '53', serviceId: 'XYZ' })
    );

    spyOn(headwayService, 'fetchFrequentServiceInfo').and.returnValue(of({ numHours: 50, totalHours: 100 }));

    spectator.setRouteParam('nocCode', 'OP01');
    spectator.setRouteParam('lineId', 'LN12345');

    // Need to set non-null from and to dates to make the params$ subject emit
    component.dateRange.setValue({
      from: DateTime.fromISO('2021-01-01T00:00:00'),
      to: DateTime.fromISO('2021-02-01T00:00:00'),
    });

    spectator.click(byText('Timeline'));
    spectator.detectChanges();

    await spectator.fixture.whenStable();

    component.overviewMode = 'excess-wait-time';
    spectator.detectChanges();

    await spectator.fixture.whenStable();

    expect(
      spectator.query(
        byText(
          '50 hours out of a total 100 service hours during the selected period operated on a frequent service basis. Excess Waiting Time is averaged over the period in which the service is running on a frequent basis.'
        )
      )
    ).toBeVisible();
  });
});
