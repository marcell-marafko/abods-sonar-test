import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { LayoutModule } from 'src/app/layout/layout.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { OnTimeModule } from '../on-time.module';
import { ServiceMapComponent } from './service-map.component';
import { ServicePattern, TransitModelService } from '../transit-model.service';
import { of } from 'rxjs';
import { StopType } from '../../../generated/graphql';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { MockModule } from 'ng-mocks';
import { DateTime } from 'luxon';
import { OnTimeService } from '../on-time.service';

describe('ServiceMapComponent', () => {
  let spectator: Spectator<ServiceMapComponent>;
  let component: ServiceMapComponent;
  let transitModelService: TransitModelService;
  let onTimeService: OnTimeService;

  const createComponent = createComponentFactory({
    component: ServiceMapComponent,
    imports: [OnTimeModule, SharedModule, LayoutModule],
    overrideModules: [
      [OnTimeModule, { remove: { imports: [NgxMapboxGLModule] }, add: { imports: [MockModule(NgxMapboxGLModule)] } }],
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    transitModelService = spectator.inject(TransitModelService);
    onTimeService = spectator.inject(OnTimeService);
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should generate service patterns feature', () => {
    const stops: StopType[] = [
      { stopId: 'ST0000001', stopName: 'Mansfield', lon: 53.1472, lat: 1.1987 },
      { stopId: 'ST0000002', stopName: 'Sheffield', lon: 53.383331, lat: -1.466667 },
    ];
    const servicePatterns: ServicePattern[] = [
      { servicePatternId: 'SVC0000000001', name: 'Mansfield to Sheffield', stops },
      { servicePatternId: 'SVC0000000002', name: 'Sheffield to Mansfield', stops: stops.slice().reverse() },
    ];

    const tmSpy = spyOn(transitModelService, 'fetchServicePatternStops').and.returnValue(of(servicePatterns));
    const otpSpy = spyOn(onTimeService, 'fetchStopPerformanceList').and.returnValue(of([]));

    const fromTimestamp = DateTime.fromISO('2021-07-01T00:00:00Z');
    const toTimestamp = DateTime.fromISO('2021-07-31T23:59:59.999Z');
    component.params = { fromTimestamp, toTimestamp, filters: { nocCodes: ['OP152'], lineIds: ['LN12345'] } };
    spectator.fixture.detectChanges();

    expect(tmSpy).toHaveBeenCalledWith('OP152', 'LN12345');
    expect(otpSpy).toHaveBeenCalledWith({
      fromTimestamp,
      toTimestamp,
      filters: {
        nocCodes: ['OP152'],
        lineIds: ['LN12345'],
      },
    });

    expect(spectator.component.servicePatterns).toBeTruthy();
    expect(spectator.component.servicePatterns?.type).toEqual('FeatureCollection');
    expect(spectator.component.servicePatterns?.features?.length).toEqual(2);
    expect(spectator.component.servicePatterns?.features?.[0].geometry?.coordinates).toEqual([
      [53.1472, 1.1987],
      [53.383331, -1.466667],
    ]);

    expect(spectator.component.servicePatterns?.features?.[1].geometry?.coordinates).toEqual([
      [53.383331, -1.466667],
      [53.1472, 1.1987],
    ]);

    expect(spectator.component.stops).toBeTruthy();
    expect(spectator.component.stops?.type).toEqual('FeatureCollection');
    expect(spectator.component.stops?.features?.length).toEqual(2);
    expect(spectator.component.stops?.features?.[0].geometry?.coordinates).toEqual([53.1472, 1.1987]);
    expect(spectator.component.stops?.features?.[0].properties?.naptan).toEqual('0000001');
    expect(spectator.component.stops?.features?.[0].properties?.stopName).toEqual('Mansfield');
    expect(spectator.component.stops?.features?.[1].geometry?.coordinates).toEqual([53.383331, -1.466667]);
    expect(spectator.component.stops?.features?.[1].properties?.naptan).toEqual('0000002');
    expect(spectator.component.stops?.features?.[1].properties?.stopName).toEqual('Sheffield');
  });
});
