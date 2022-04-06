import { RouterTestingModule } from '@angular/router/testing';
import { byText, byTextContent, createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { of } from 'rxjs';
import { fakeEvent } from 'src/test-support/faker';
import { FeedMonitoringModule } from '../feed-monitoring.module';
import { FeedMonitoringService } from '../feed-monitoring.service';
import { AlertListComponent } from './alert-list.component';
import * as Faker from 'faker';
import { DateTime } from 'luxon';
import { AlertMode, AlertType } from './alert-list-view-model';
import { SharedModule } from 'src/app/shared/shared.module';
import { AlertComponent } from './alert/alert.component';
import { dateTimeCloseEnoughToEqualityMatcher } from 'src/test-support/equality';

describe('AlertListComponent', () => {
  let spectator: SpectatorRouting<AlertListComponent>;
  let service: FeedMonitoringService;
  const createComponent = createRoutingFactory({
    component: AlertListComponent,
    imports: [FeedMonitoringModule, RouterTestingModule, ApolloTestingModule, SharedModule],
    declarations: [AlertComponent],
  });

  beforeAll(() => Faker.seed(434));

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });

  it('should fetch recent events', () => {
    jasmine.addCustomEqualityTester(dateTimeCloseEnoughToEqualityMatcher);

    spectator = createComponent();

    spectator.component.mode = AlertMode.LiveStatus;

    service = spectator.inject(FeedMonitoringService);
    spyOn(service, 'fetchAlerts').and.returnValue(of([]));

    spectator.setRouteParam('nocCode', 'NOC01');

    spectator.detectChanges();

    expect(service.fetchAlerts).toHaveBeenCalledWith('NOC01', DateTime.local().minus({ days: 1 }), DateTime.local());
  });

  it('should fetch windowed events', () => {
    spectator = createComponent();

    spectator.component.mode = AlertMode.FeedHistory;

    const startDate = DateTime.fromISO('2020-02-03T00:00:00Z');
    const endDate = DateTime.fromISO('2020-02-04T00:00:00Z');

    spectator.setInput({ date: startDate });

    service = spectator.inject(FeedMonitoringService);
    spyOn(service, 'fetchAlerts').and.returnValue(of([]));

    spectator.setRouteParam('nocCode', 'NOC01');

    spectator.detectChanges();

    expect(service.fetchAlerts).toHaveBeenCalledWith('NOC01', startDate, endDate);
  });

  it('should show message', () => {
    spectator = createComponent();

    spectator.component.mode = AlertMode.LiveStatus;

    service = spectator.inject(FeedMonitoringService);

    const message = 'This text should be there';

    spyOn(service, 'fetchAlerts').and.callFake((_, start, end) =>
      of([fakeEvent({ message, start, end, type: AlertType.VehicleCountDisparityEvent })])
    );

    spectator.setRouteParam('nocCode', 'NOC01');

    spectator.detectChanges();

    expect(spectator.query(byText(message))).toBeTruthy();
  });

  const typeTestCases = [
    { type: AlertType.FeedUnavailableEvent, title: 'Feed data unavailable' },
    { type: AlertType.VehicleCountDisparityEvent, title: 'Vehicle count disparity' },
    { type: AlertType.FeedAvailableEvent, title: 'Feed data available' },
  ];

  typeTestCases.forEach(({ type, title }) =>
    it(`should show event type for ${type}`, () => {
      spectator = createComponent();

      spectator.component.mode = AlertMode.LiveStatus;

      service = spectator.inject(FeedMonitoringService);

      spyOn(service, 'fetchAlerts').and.callFake((_, start, end) => of([fakeEvent({ type, start, end })]));

      spectator.setRouteParam('nocCode', 'NOC01');

      spectator.detectChanges();

      expect(spectator.query(byText(title))).toBeTruthy();
    })
  );

  it('should update when date changed', () => {
    spectator = createComponent();

    spectator.component.mode = AlertMode.FeedHistory;

    const initDate = DateTime.fromISO('2020-02-03T00:00:00Z');

    spectator.setInput({ date: initDate });

    service = spectator.inject(FeedMonitoringService);
    const spy = spyOn(service, 'fetchAlerts').and.returnValue(of([]));

    spectator.setRouteParam('nocCode', 'NOC01');

    spy.calls.reset();

    const startDate = DateTime.fromISO('2020-03-03T00:00:00Z');
    const endDate = DateTime.fromISO('2020-03-04T00:00:00Z');

    spectator.setInput({ date: startDate });

    spectator.detectChanges();

    expect(service.fetchAlerts).toHaveBeenCalledWith('NOC01', startDate, endDate);
  });

  it('should show no alerts message', () => {
    spectator = createComponent();

    spectator.component.mode = AlertMode.LiveStatus;

    service = spectator.inject(FeedMonitoringService);

    spyOn(service, 'fetchAlerts').and.returnValue(of([]));

    expect(spectator.query(byText('No events have been observed in the feed for this time period.'))).toBeTruthy();
  });

  it('should display feed history alerts in ascending chronological order', () => {
    spectator = createComponent();

    spectator.component.mode = AlertMode.FeedHistory;

    service = spectator.inject(FeedMonitoringService);

    spyOn(service, 'fetchAlerts').and.callFake((_) =>
      of([
        fakeEvent({ start: DateTime.fromISO('2020-12-08T10:52:00Z') }),
        fakeEvent({ start: DateTime.fromISO('2020-12-08T10:50:00Z') }),
        fakeEvent({ start: DateTime.fromISO('2020-12-08T10:51:00Z') }),
      ])
    );

    spectator.setRouteParam('nocCode', 'NOC01');

    spectator.setInput({ date: DateTime.fromISO('2020-12-08T00:00:00Z') });

    spectator.detectChanges();

    expect(
      spectator.query(byText('10:50', { selector: '.alert-list__items li:nth-child(1) .alert__timestamp' }))
    ).toBeTruthy();

    expect(
      spectator.query(byText('10:52', { selector: '.alert-list__items li:nth-child(3) .alert__timestamp' }))
    ).toBeTruthy();
  });

  it('should display live status alerts in descending chronological order', () => {
    spectator = createComponent();

    spectator.component.mode = AlertMode.LiveStatus;

    service = spectator.inject(FeedMonitoringService);

    const now = DateTime.utc();
    const time1 = now.minus({ hours: 3, minutes: 1 });
    const time2 = now.minus({ hours: 3, minutes: 2 });
    const time3 = now.minus({ hours: 3, minutes: 3 });

    spyOn(service, 'fetchAlerts').and.callFake((_) =>
      of([fakeEvent({ start: time3 }), fakeEvent({ start: time1 }), fakeEvent({ start: time2 })])
    );

    spectator.setRouteParam('nocCode', 'NOC01');

    spectator.detectChanges();

    expect(
      spectator.query(
        byTextContent(new RegExp(time1.toFormat('HH:mm')), {
          selector: '.alert-list__items li:nth-child(1) .alert__timestamp',
        })
      )
    ).toBeTruthy();

    expect(
      spectator.query(
        byText(new RegExp(time3.toFormat('HH:mm')), {
          selector: '.alert-list__items li:nth-child(3) .alert__timestamp',
        })
      )
    ).toBeTruthy();
  });
});
