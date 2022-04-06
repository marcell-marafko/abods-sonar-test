import { createServiceFactory } from '@ngneat/spectator';
import { SpectatorService } from '@ngneat/spectator/lib/spectator-service/spectator-service';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import {
  CorridorGranularity,
  CorridorsListDocument,
  CorridorsStopSearchDocument,
  CorridorsSubsequentStopsDocument,
  CorridorStatsDocument,
  CorridorStatsType,
  CreateCorridorDocument,
  DeleteCorridorDocument,
  GetCorridorDocument,
  ICorridorJourneyTimeStats,
} from '../../generated/graphql';
import { CorridorsService, CorridorStatsViewParams, Stop } from './corridors.service';
import { DateTime } from 'luxon';
import objectContaining = jasmine.objectContaining;

const journeyTime: ICorridorJourneyTimeStats = {
  avgTransitTime: 5,
  minTransitTime: 1,
  maxTransitTime: 10,
  percentile5: 2,
  percentile25: 3,
  percentile75: 7,
  percentile95: 9,
};

const params: CorridorStatsViewParams = {
  corridorId: '150',
  from: DateTime.fromISO('2021-10-22', { zone: 'utc' }),
  to: DateTime.fromISO('2021-11-21', { zone: 'utc' }),
  granularity: CorridorGranularity.Day,
  stops: [{ stopId: 'ST0001', stopName: 'A' } as Stop, { stopId: 'ST0002', stopName: 'B' } as Stop],
};

const stats: CorridorStatsType = {
  summaryStats: {
    scheduledTransits: 100,
    averageJourneyTime: 90,
    totalTransits: 95,
    numberOfServices: 5,
  },
  journeyTimeStats: [{ ts: DateTime.fromISO('2021-11-01').toMillis(), ...journeyTime }],
  journeyTimeTimeOfDayStats: [{ hour: 9, ...journeyTime }],
  journeyTimeDayOfWeekStats: [{ dow: 1, ...journeyTime }],
  journeyTimeHistogram: [
    {
      hist: [
        { bin: 89, freq: 3 },
        { bin: 90, freq: 6 },
        { bin: 92, freq: 1 },
      ],
    },
  ],
  journeyTimePerServiceStats: [
    {
      lineName: 'Sheffield to Mansfield',
      noc: 'OP01',
      operatorName: 'Stagecoach East Midlands',
      totalJourneyTime: 810,
      totalScheduledJourneyTime: 900,
      scheduledTransits: 10,
      recordedTransits: 9,
      servicePatternName: '',
    },
  ],
};

describe('CorridorsService', () => {
  let spectator: SpectatorService<CorridorsService>;
  let controller: ApolloTestingController;
  const serviceFactory = createServiceFactory({
    service: CorridorsService,
    imports: [ApolloTestingModule],
  });

  beforeEach(() => {
    spectator = serviceFactory();
    controller = spectator.inject(ApolloTestingController);
  });

  it('should query stops', () => {
    spectator.service.queryStops('station').subscribe((actual) => {
      expect(actual).not.toBeNull();
      expect(actual.length).toEqual(1);
      expect(actual[0].stopId).toEqual('ST012345');
      expect(actual[0].stopName).toEqual('Station Road');
    });

    const op = controller.expectOne(CorridorsStopSearchDocument);

    expect(op.operation.variables.query).toEqual('station');

    op.flush({
      data: {
        corridor: {
          addFirstStop: [
            {
              stopId: 'ST012345',
              stopName: 'Station Road',
              lat: 50,
              lon: 0,
            },
          ],
        },
      },
    });

    controller.verify();
  });

  it('should fetch subsequent stops', () => {
    spectator.service.fetchSubsequentStops(['ST012345']).subscribe((actual) => {
      expect(actual).not.toBeNull();
      expect(actual.length).toEqual(1);
      expect(actual[0].stopId).toEqual('ST023456');
      expect(actual[0].stopName).toEqual('High Street');
    });

    const op = controller.expectOne(CorridorsSubsequentStopsDocument);

    expect(op.operation.variables.stopList).toEqual(['ST012345']);

    op.flush({
      data: {
        corridor: {
          addSubsequentStops: [
            {
              stopId: 'ST023456',
              stopName: 'High Street',
              lat: 51,
              lon: 0,
            },
          ],
        },
      },
    });

    controller.verify();
  });

  it('should save corridors', () => {
    spectator.service.createCorridor('my new corridor', ['ST012345']).subscribe();

    controller.expectOne((operation) => {
      expect(operation.query.definitions).toEqual(CreateCorridorDocument.definitions);
      expect(operation.variables.name).toEqual('my new corridor');
      expect(operation.variables.stopIds).toEqual(['ST012345']);
      return true;
    });

    controller.verify();
  });

  it('should fetch corridors', () => {
    spectator.service.fetchCorridors().subscribe((actual) => {
      expect(actual).not.toBeNull();
      expect(actual.length).toEqual(1);
      expect(actual[0].id).toEqual(234);
      expect(actual[0].name).toEqual('Test corridor');
      expect(actual[0].numStops).toEqual(2);
    });

    const op = controller.expectOne(CorridorsListDocument);

    op.flush({
      data: {
        corridor: {
          corridorList: [
            {
              id: 234,
              name: 'Test corridor',
              stops: [{ stopId: 'ST000001' }, { stopId: 'ST000002' }],
            },
          ],
        },
      },
    });

    controller.verify();
  });

  it('should fetch corridors by id', () => {
    spectator.service.fetchCorridorById(150).subscribe((actual) => {
      expect(actual).not.toBeNull();
      expect(actual.id).toEqual(150);
      expect(actual.name).toEqual('Test corridor');
      expect(actual.stops.length).toEqual(2);
      expect(actual.stops[0].stopId).toEqual('ST000001');
      expect(actual.stops[1].stopId).toEqual('ST000002');
      expect(actual.stops[0].naptan).toEqual('000001');
      expect(actual.stops[1].naptan).toEqual('000002');
    });

    const op = controller.expectOne(GetCorridorDocument);

    expect(op.operation.variables.corridorId).toEqual(150);

    op.flush({
      data: {
        corridor: {
          getCorridor: {
            id: 150,
            name: 'Test corridor',
            stops: [
              { stopId: 'ST000001', stopName: 'Foo street', stopLocation: { latitude: 50, longitude: 0 } },
              { stopId: 'ST000002', stopName: 'Bar road', stopLocation: { latitude: 51, longitude: 0 } },
            ],
          },
        },
      },
    });

    controller.verify();
  });

  it('should fetch corridor stats', () => {
    spectator.service.fetchStats(params).subscribe((actual) => {
      expect(actual.summaryStats.numberOfServices).toEqual(5);
    });

    const op = controller.expectOne(CorridorStatsDocument);

    expect(op.operation.variables.params).toEqual(
      objectContaining({
        corridorId: '150',
        fromTimestamp: '2021-10-22T00:00:00.000Z',
        toTimestamp: '2021-11-21T00:00:00.000Z',
        granularity: CorridorGranularity.Day,
        stopList: ['ST0001', 'ST0002'],
      })
    );

    op.flush({ data: { corridor: { stats } } });

    controller.verify();
  });

  it('should convert corridor stats', () => {
    const actual = spectator.service.convertStats(stats, params);

    expect(actual.journeyTimeStats.length).toEqual(31);
    expect(actual.journeyTimeTimeOfDayStats.length).toEqual(25);
    expect(actual.journeyTimeDayOfWeekStats.length).toEqual(7);
    expect(actual.journeyTimeHistogram.length).toEqual(5);
    expect(actual.journeyTimePerServiceStats.length).toEqual(1);

    // from midnight to midnight, inclusive
    expect(actual.journeyTimeTimeOfDayStats[0].hour).toEqual(0);
    expect(actual.journeyTimeTimeOfDayStats[24].hour).toEqual(24);

    // Monday to Sunday
    expect(actual.journeyTimeDayOfWeekStats[0].category).toEqual('Mon');
    expect(actual.journeyTimeDayOfWeekStats[6].category).toEqual('Sun');

    expect(actual.journeyTimePerServiceStats[0].noc).toEqual('OP01');
    expect(actual.journeyTimePerServiceStats[0].operatorName).toEqual('Stagecoach East Midlands');
  });

  it('should delete corridors', () => {
    spectator.service.deleteCorridor(1234).subscribe();

    controller.expectOne((operation) => {
      expect(operation.query.definitions).toEqual(DeleteCorridorDocument.definitions);
      expect(operation.variables.corridorId).toEqual(1234);
      return true;
    });

    controller.verify();
  });
});
