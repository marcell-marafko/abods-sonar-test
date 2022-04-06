import { TestBed } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { FeedMonitoringService } from './feed-monitoring.service';
import { DateTime } from 'luxon';
import { EventStatsDocument } from '../../generated/graphql';

describe('FeedMonitoringService', () => {
  let service: FeedMonitoringService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, AgGridModule.withComponents([])],
    });
    service = TestBed.inject(FeedMonitoringService);
    controller = TestBed.inject(ApolloTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be send dates in UTC', () => {
    service.fetchAlertStats('ARBB', DateTime.fromISO('2021-05-05T14:30:00.000+01:00')).subscribe((stats) => {
      expect(stats).not.toBeNull();
    });

    const op = controller.expectOne(EventStatsDocument);

    expect(op.operation.variables.nocCode).toEqual('ARBB');
    expect(op.operation.variables.start).toEqual(DateTime.utc(2021, 2, 4).toJSDate());
    expect(op.operation.variables.end).toEqual(DateTime.utc(2021, 5, 5).toJSDate());

    op.flush({
      data: {
        eventStats: [{}],
      },
    });

    controller.verify();
  });
});
