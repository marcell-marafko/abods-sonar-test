import { Injectable } from '@angular/core';
import {
  FrequentServiceInfoType,
  HeadwayFrequentServiceInfoGQL,
  HeadwayFrequentServicesGQL,
  HeadwayInputType,
  HeadwayOverviewGQL,
  HeadwayTimeSeriesGQL,
} from '../../generated/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { nonNullishArray, NullishArray } from './transit-model.service';
import { assertNonNullish } from '../shared/rxjs-operators';

export interface Headway {
  actual: number;
  scheduled: number;
  excess: number;
}

export interface HeadwayTimeSeries extends Headway {
  ts: string;
}

export interface FrequentService {
  serviceId: string;
}

export type HeadwayParams = Omit<HeadwayInputType, 'sortBy'>;

const assertHasOneElement: (arr: NullishArray<string>) => asserts arr is [string] = (arr) => {
  if (!arr?.length || arr[0] === null || arr[0] === undefined) {
    throw new Error('Array must have one element'); // This should never happen
  }
};

@Injectable({
  providedIn: 'root',
})
export class HeadwayService {
  constructor(
    private timeSeriesGQL: HeadwayTimeSeriesGQL,
    private overviewGQL: HeadwayOverviewGQL,
    private frequentServicesGQL: HeadwayFrequentServicesGQL,
    private frequentServiceInfoGQL: HeadwayFrequentServiceInfoGQL
  ) {}

  fetchTimeSeries(params: HeadwayParams): Observable<HeadwayTimeSeries[]> {
    return this.timeSeriesGQL
      .fetch({ params }, { fetchPolicy: 'no-cache' })
      .pipe(map((result) => nonNullishArray(result.data?.headwayMetrics?.headwayTimeSeries)));
  }

  fetchOverview(params: HeadwayParams): Observable<Headway> {
    return this.overviewGQL.fetch({ params }, { fetchPolicy: 'no-cache' }).pipe(
      map((result) => result.data?.headwayMetrics.headwayOverview),
      assertNonNullish()
    );
  }

  fetchFrequentServices({ filters, fromTimestamp, toTimestamp }: HeadwayParams): Observable<FrequentService[]> {
    assertHasOneElement(filters?.nocCodes);
    const [noc] = filters?.nocCodes;

    return this.frequentServicesGQL
      .fetch(
        {
          noc,
          fromTimestamp,
          toTimestamp,
        },
        { fetchPolicy: 'no-cache' }
      )
      .pipe(map((result) => nonNullishArray(result.data?.headwayMetrics.frequentServices)));
  }

  fetchFrequentServiceInfo({
    filters,
    fromTimestamp,
    toTimestamp,
  }: HeadwayParams): Observable<FrequentServiceInfoType> {
    assertHasOneElement(filters?.nocCodes);
    assertHasOneElement(filters?.lineIds);
    const [noc] = filters?.nocCodes;
    const [lineId] = filters?.lineIds;

    return this.frequentServiceInfoGQL
      .fetch(
        {
          noc,
          lineId,
          fromTimestamp,
          toTimestamp,
        },
        { fetchPolicy: 'no-cache' }
      )
      .pipe(
        map((result) => result.data?.headwayMetrics.frequentServiceInfo),
        assertNonNullish()
      );
  }
}
