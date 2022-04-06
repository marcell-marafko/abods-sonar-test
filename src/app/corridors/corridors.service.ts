import { Injectable } from '@angular/core';
import {
  CorridorGranularity,
  CorridorHistogramType,
  CorridorsListGQL,
  CorridorsStopSearchGQL,
  CorridorsSubsequentStopsGQL,
  CorridorStatsDayOfWeekType,
  CorridorStatsGQL,
  CorridorStatsInputType,
  CorridorStatsTimeOfDayType,
  CorridorStatsType,
  CorridorType,
  CreateCorridorGQL,
  DeleteCorridorGQL,
  GetCorridorGQL,
  StopInfoType,
  StopType,
} from '../../generated/graphql';
import { map } from 'rxjs/operators';
import { Definitely, nonNullishArray } from '../on-time/transit-model.service';
import { Observable } from 'rxjs';
import { assertNonNullish } from '../shared/rxjs-operators';
import { FeatureCollection, Point } from 'geojson';
import { featureCollection, point } from '@turf/turf';
import { position } from '../shared/geo';
import { DateTime, Duration, Interval } from 'luxon';
import {
  keyBy as _keyBy,
  max as _max,
  mergeWith as _mergeWith,
  min as _min,
  range as _range,
  sortBy as _sortBy,
  values as _values,
} from 'lodash-es';

export type Stop = Pick<StopType, 'stopId' | 'stopName' | 'lon' | 'lat'> & { naptan: string; intId: number };

export type CorridorSummary = Definitely<Pick<CorridorType, 'id' | 'name'>> & { numStops: number };

export type Corridor = Pick<CorridorType, 'id' | 'name'> & { stops: Stop[] };

export type CorridorStats = Pick<
  Definitely<CorridorStatsType>,
  'summaryStats' | 'journeyTimeStats' | 'journeyTimePerServiceStats' | 'journeyTimeTimeOfDayStats'
> & {
  journeyTimeTimeOfDayStats: (CorridorStatsTimeOfDayType & {
    category: string;
    binLabel: string;
  })[];
  journeyTimeDayOfWeekStats: (CorridorStatsDayOfWeekType & { category: string; binLabel: string })[];
  journeyTimeHistogram: CorridorHistogramType[];
};

export type CorridorStatsParams = Pick<
  CorridorStatsInputType,
  'corridorId' | 'fromTimestamp' | 'toTimestamp' | 'stopList'
> &
  Definitely<Pick<CorridorStatsInputType, 'granularity'>>;

export interface CorridorStatsViewParams {
  corridorId: string;
  from: DateTime;
  to: DateTime;
  granularity: CorridorGranularity;
  stops: Stop[];
}

let uniqueId = 0;

function isStopLocation(
  obj: Pick<StopType, 'lon' | 'lat'> | Pick<StopInfoType, 'stopLocation'>
): obj is Pick<StopInfoType, 'stopLocation'> {
  return Object.prototype.hasOwnProperty.call(obj, 'stopLocation');
}
const toStop: (stop: StopType | StopInfoType) => Stop = ({ __typename, stopId, stopName, ...stop }) => ({
  stopId,
  stopName,
  ...(isStopLocation(stop) ? { lon: stop.stopLocation.longitude, lat: stop.stopLocation.latitude } : stop),
  naptan: stopId.substring(2),
  intId: ++uniqueId,
});

export const asGeoJsonPoints: (stops: Stop[]) => FeatureCollection<Point, Stop> = (stops) =>
  featureCollection(stops.map((stop) => point(position(stop), stop, { id: stop.intId })));

function* timeSeriesRange(interval: Interval, granularity: CorridorGranularity) {
  let cursor = interval.start;
  while (cursor < interval.end) {
    yield cursor;
    cursor = cursor.plus({ [granularity]: 1 });
  }
}

const fillGaps = <T, U, K extends keyof T>(
  key: K,
  data: T[],
  defaultRange: T[K][],
  formatter: (n: T[K]) => U = () => ({} as U),
  sortKey?: keyof U
): (T & U)[] => {
  const defaults = defaultRange.map((n) => ({ [key]: n }));
  const completeData = _values(_mergeWith(_keyBy(defaults, key), _keyBy(nonNullishArray(data), key))).map((item) => ({
    ...item,
    ...formatter(item[key]),
  }));
  return sortKey ? _sortBy(completeData, sortKey) : completeData;
};

const formatMinuteSeconds = (minute: number) => Duration.fromObject({ minute }).toFormat('m:ss');
const formatDuration = (minute: number) => {
  const min = Duration.fromObject({ minute });
  return `${min.toFormat('m:ss')} - ${min.plus({ seconds: 59 }).toFormat('m:ss')}`;
};
const formatDayOfWeekShort = (weekday: number) => DateTime.fromObject({ weekday }).toFormat('ccc');
const formatDayOfWeek = (weekday: number) => DateTime.fromObject({ weekday }).toFormat('cccc');
const isoDayOfWeek = (dow: number) => (dow === 0 ? 7 : dow);

@Injectable({ providedIn: 'root' })
export class CorridorsService {
  constructor(
    private corridorsStopSearchQuery: CorridorsStopSearchGQL,
    private corridorsSubsequentStopsQuery: CorridorsSubsequentStopsGQL,
    private corridorsListQuery: CorridorsListGQL,
    private getCorridorGQL: GetCorridorGQL,
    private corridorStatsQuery: CorridorStatsGQL,
    private createCorridorMutation: CreateCorridorGQL,
    private deleteCorridorMutation: DeleteCorridorGQL
  ) {}

  queryStops(query: string): Observable<Stop[]> {
    return this.corridorsStopSearchQuery
      .fetch({ query })
      .pipe(map((result) => nonNullishArray(result?.data?.corridor.addFirstStop).map(toStop)));
  }

  fetchSubsequentStops(stopList: string[]): Observable<Stop[]> {
    return this.corridorsSubsequentStopsQuery
      .fetch({ stopList })
      .pipe(map((result) => nonNullishArray(result?.data?.corridor.addSubsequentStops).map(toStop)));
  }

  fetchCorridors(): Observable<CorridorSummary[]> {
    return this.corridorsListQuery.fetch().pipe(
      map((result) =>
        nonNullishArray(result.data?.corridor.corridorList).map(({ stops, ...corridor }) => ({
          ...corridor,
          numStops: nonNullishArray(stops).length,
        }))
      )
    );
  }

  fetchCorridorById(corridorId: number): Observable<Corridor> {
    return this.getCorridorGQL.fetch({ corridorId }).pipe(
      map((result) => {
        if (result.errors && result.errors.length > 0) {
          throw result.errors[0].message;
        }
        return result.data?.corridor.getCorridor;
      }),
      assertNonNullish(),
      map(({ stops, ...corridor }) => ({ stops: nonNullishArray(stops).map(toStop), ...corridor }))
    );
  }

  fetchStats(params: CorridorStatsViewParams): Observable<CorridorStats> {
    const { corridorId, from, to, granularity, stops } = params;
    return this.corridorStatsQuery
      .fetch({
        params: {
          corridorId,
          fromTimestamp: from.toUTC().toISO(),
          toTimestamp: to.toUTC().toISO(),
          granularity,
          stopList: stops.map((stop) => stop.stopId),
        },
      })
      .pipe(
        map((result) => result.data?.corridor.stats),
        assertNonNullish(),
        map((stats) => this.convertStats(stats, params))
      );
  }

  convertStats(stats: CorridorStatsType, params: CorridorStatsViewParams): CorridorStats {
    const timeSeries = nonNullishArray(stats.journeyTimeStats);
    const dayOfWeek = nonNullishArray(stats.journeyTimeDayOfWeekStats);
    const timeOfDay = nonNullishArray(stats.journeyTimeTimeOfDayStats);
    const histogram = nonNullishArray(nonNullishArray(stats.journeyTimeHistogram)?.[0]?.hist);
    const histBins = histogram.map((h) => h.bin);
    const histRange = _range(_min(histBins) ?? 0, (_max(histBins) ?? 0) + 2);

    return {
      summaryStats: stats.summaryStats ?? {},
      journeyTimeStats: fillGaps(
        'ts',
        timeSeries,
        Array.from(
          timeSeriesRange(Interval.fromDateTimes(params.from, params.to), params.granularity)
        ).map((dateTime) => dateTime.toUTC().toISO({ includeOffset: false, suppressMilliseconds: true }))
      ),
      journeyTimePerServiceStats: nonNullishArray(stats.journeyTimePerServiceStats),
      journeyTimeDayOfWeekStats: fillGaps(
        'dow',
        dayOfWeek,
        _range(0, 7),
        (dow) => ({
          category: formatDayOfWeekShort(isoDayOfWeek(dow)),
          binLabel: formatDayOfWeek(isoDayOfWeek(dow)),
          isoDayOfWeek: isoDayOfWeek(dow),
        }),
        'isoDayOfWeek'
      ),
      journeyTimeTimeOfDayStats: fillGaps('hour', timeOfDay, _range(0, 25), (hour) => ({
        category: `${DateTime.fromObject({ hour }).toFormat('HH:mm')}`,
        binLabel: `${DateTime.fromObject({ hour }).toFormat('HH:mm')} - ${DateTime.fromObject({
          hour: hour + 1,
        }).toFormat('HH:mm')}`,
      })),
      journeyTimeHistogram: fillGaps('bin', histogram, histRange, (bin) => ({
        journeyTime: formatMinuteSeconds(Number(bin)),
        duration: formatDuration(Number(bin)),
      })),
    };
  }

  createCorridor(name: string, stopIds: string[]): Observable<void> {
    return this.createCorridorMutation.mutate({ name, stopIds }).pipe(
      map((result) => {
        if (!result.data?.createCorridor.success) {
          throw result.data?.createCorridor.error ?? result.errors?.map((err) => err.message) ?? 'Unknown error';
        }
      })
    );
  }

  deleteCorridor(corridorId: number): Observable<void> {
    return this.deleteCorridorMutation.mutate({ corridorId }).pipe(
      map((result) => {
        if (!result.data?.deleteCorridor.success) {
          throw result.data?.deleteCorridor.error ?? result.errors?.map((err) => err.message) ?? 'Unknown error';
        }
      })
    );
  }
}
