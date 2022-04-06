import { byLabel, byText, byTextContent, createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CorridorsService, CorridorStatsViewParams } from '../corridors.service';
import { of, throwError } from 'rxjs';
import { fakeAsync, flush, tick } from '@angular/core/testing';
import { ViewCorridorComponent } from './view-corridor.component';
import { DateTime, Settings } from 'luxon';
import { CorridorGranularity } from '../../../generated/graphql';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AgGridModule } from 'ag-grid-angular';
import { LuxonModule } from 'luxon-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JourneyTimeChartComponent } from '../journey-time-chart/journey-time-chart.component';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SegmentSelectorComponent } from '../segment-selector/segment-selector.component';
import { MockComponent, MockModule } from 'ng-mocks';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

describe('ViewCorridorComponent', () => {
  let spectator: SpectatorRouting<ViewCorridorComponent>;
  let service: CorridorsService;

  const createComponent = createRoutingFactory({
    component: ViewCorridorComponent,
    imports: [
      SharedModule,
      LayoutModule,
      NgxTippyModule,
      LuxonModule,
      FormsModule,
      ReactiveFormsModule,
      ApolloTestingModule,
      RouterTestingModule,
      AgGridModule.withComponents([]),
      HttpClientTestingModule,
      MockModule(NgxMapboxGLModule),
    ],
    declarations: [MockComponent(JourneyTimeChartComponent), SegmentSelectorComponent],
    stubsEnabled: false,
  });

  beforeEach(() => {
    Settings.now = () => 1630494000000; // 2021-09-01T12:00:00

    spectator = createComponent();
    service = spectator.inject(CorridorsService);
  });

  const corridor = {
    id: 123,
    name: 'Test corridor',
    stops: [
      {
        stopId: 'ST1234',
        stopName: 'Station road',
        lat: 50,
        lon: 0,
        naptan: '1234',
        intId: 1,
      },
      {
        stopId: 'ST2345',
        stopName: 'Something street',
        lat: 50,
        lon: 0,
        naptan: '2345',
        intId: 2,
      },
    ],
  };

  it('should fetch corridor by id', () => {
    const spy = spyOn(service, 'fetchCorridorById').and.returnValue(of(corridor));

    spectator.setRouteParam('corridorId', '123');

    spectator.detectChanges();

    expect(spy).toHaveBeenCalledWith(123);
    expect(spectator.query(byText('Test corridor'))).toBeVisible();
  });

  it('should fetch stats', fakeAsync(() => {
    spyOn(service, 'fetchCorridorById').and.returnValue(of(corridor));

    const spy = spyOn(service, 'fetchStats').and.returnValue(
      of({
        summaryStats: {
          scheduledTransits: 100,
          averageJourneyTime: 90,
          totalTransits: 90,
          numberOfServices: 5,
        },
        journeyTimeDayOfWeekStats: [],
        journeyTimeHistogram: [],
        journeyTimePerServiceStats: [],
        journeyTimeStats: [],
        journeyTimeTimeOfDayStats: [],
      })
    );

    spectator.setRouteParam('corridorId', '123');

    spectator.detectChanges();
    tick(100);

    spectator.selectOption(byLabel('Preset'), 'last7');

    spectator.detectChanges();
    tick(100);

    const expectedParams: CorridorStatsViewParams = {
      corridorId: '123',
      from: DateTime.fromISO('2021-08-25'),
      to: DateTime.fromISO('2021-09-01'),
      granularity: CorridorGranularity.Day,
      stops: [],
    };

    expect(spy).toHaveBeenCalledWith(expectedParams);
    expect(spectator.query(byTextContent('Total transits90', { selector: '.stat' }))).toBeVisible();
    expect(spectator.query(byTextContent('Services5', { selector: '.stat' }))).toBeVisible();
    expect(spectator.query(byTextContent('Average journey time01:30', { selector: '.stat' }))).toBeVisible();
    expect(spectator.query(byTextContent('Missing transits10', { selector: '.stat' }))).toBeVisible();
    flush();
  }));

  it('should select day granularity for a 5 day period', fakeAsync(() => {
    spyOn(service, 'fetchCorridorById').and.returnValue(of(corridor));

    const spy = spyOn(service, 'fetchStats').and.returnValue(
      of({
        summaryStats: {
          scheduledTransits: 100,
          averageJourneyTime: 90,
          totalTransits: 90,
          numberOfServices: 5,
        },
        journeyTimeDayOfWeekStats: [],
        journeyTimeHistogram: [],
        journeyTimePerServiceStats: [],
        journeyTimeStats: [],
        journeyTimeTimeOfDayStats: [],
      })
    );

    spectator.setRouteParam('corridorId', '123');

    spectator.detectChanges();

    const from = DateTime.fromISO('2021-08-25');
    const to = DateTime.fromISO('2021-08-30');

    spectator.component.dateRange.setValue({
      from,
      to,
    });

    tick();
    spectator.detectChanges();

    const expectedParams: Partial<CorridorStatsViewParams> = {
      from,
      to,
      granularity: CorridorGranularity.Day,
      stops: [],
    };

    expect(spy).toHaveBeenCalledWith(jasmine.objectContaining(expectedParams));
    flush();
  }));

  it('should display service breakdown grid', fakeAsync(() => {
    spyOn(service, 'fetchCorridorById').and.returnValue(of(corridor));

    spyOn(service, 'fetchStats').and.returnValue(
      of({
        summaryStats: {},
        journeyTimeDayOfWeekStats: [],
        journeyTimeHistogram: [],
        journeyTimePerServiceStats: [
          {
            lineName: '53',
            servicePatternName: 'Sheffield to Mansfield',
            noc: 'SCEM',
            operatorName: 'Stagecoach East Midlands',
            scheduledTransits: 25,
            recordedTransits: 24,
            totalJourneyTime: 60,
          },
          {
            lineName: '77',
            servicePatternName: 'Chesterfield to Worksop',
            noc: 'SCEM',
            operatorName: 'Stagecoach East Midlands',
            scheduledTransits: 50,
            recordedTransits: 45,
            totalJourneyTime: 30,
          },
        ],
        journeyTimeStats: [],
        journeyTimeTimeOfDayStats: [],
      })
    );

    spectator.setRouteParam('corridorId', '155');
    spectator.detectChanges();
    tick(100);

    spectator.selectOption(byLabel('Preset'), 'last7');

    spectator.detectChanges();
    tick(100);

    const cellContent = spectator.query('[role="row"][row-index="0"] [role="gridcell"][col-id="0"]')?.textContent;

    expect(cellContent).toEqual('53: Sheffield to Mansfield');
    flush();
  }));

  it('should display not found message is corridor does not exist', fakeAsync(() => {
    const spy = spyOn(service, 'fetchCorridorById').and.returnValue(throwError('Corridor does not exist.'));

    spectator.setRouteParam('corridorId', '123');

    spectator.detectChanges();
    tick(100);

    expect(spy).toHaveBeenCalledWith(123);
    expect(spectator.query(byText(/Corridor not found, or you do not have permission to view\./))).toBeVisible();
    flush();
  }));
});
