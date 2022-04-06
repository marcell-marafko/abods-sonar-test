import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  BasicOperatorFragment,
  EventsGQL,
  EventStatsGQL,
  EventStatsType,
  EventType,
  FeedMonitoringListGQL,
  OperatorFeedHistoryFragment,
  OperatorHistoricStatsGQL,
  OperatorListGQL,
  OperatorLiveStatusFragment,
  OperatorLiveStatusGQL,
  OperatorSparklineStatsGQL,
  VehicleStatsType,
} from 'src/generated/graphql';
import { nonNullishArray } from '../on-time/transit-model.service';

export type EventStats = Pick<EventStatsType, 'count' | 'day'>;

@Injectable({
  providedIn: 'root',
})
export class FeedMonitoringService {
  constructor(
    private feedMonitoringListQuery: FeedMonitoringListGQL,
    private operatorSparklineStatsQuery: OperatorSparklineStatsGQL,
    private operatorLiveStatusQuery: OperatorLiveStatusGQL,
    private operatorHistoricStatsQuery: OperatorHistoricStatsGQL,
    private operatorListQuery: OperatorListGQL,
    private eventsQuery: EventsGQL,
    private eventStatsQuery: EventStatsGQL
  ) {}

  get listOperators(): Observable<{ nocCode: string; name?: string | null }[]> {
    return this.operatorListQuery
      .fetch()
      .pipe(
        map(({ data }) => data?.operators?.items?.map((x) => x as { nocCode: string; name?: string | null }) ?? [])
      );
  }

  fetchFeedMonitoringList(): Observable<BasicOperatorFragment[] | null> {
    return this.feedMonitoringListQuery.fetch().pipe(
      map(({ data }) => {
        if (!data?.operators?.items?.length) {
          console.warn('No operators configured for user.');
          return [];
        } else {
          return data?.operators.items?.map((x) => x as BasicOperatorFragment);
        }
      }),
      catchError(() => of(null))
    );
  }

  fetchOperatorSparklines(
    nocCodes: string[]
  ): Observable<{ nocCode?: string; last24Hours: VehicleStatsType[] }[] | null> {
    return this.operatorSparklineStatsQuery.fetch({ nocCodes }).pipe(
      map(({ data }) => {
        if (!data?.operators?.items) {
          console.warn('Failed to fetch sparkline stats', nocCodes);
          return null;
        } else {
          return data.operators.items.map((item) => ({
            nocCode: item?.nocCode,
            last24Hours: item?.feedMonitoring?.liveStats?.last24Hours?.map((x) => x as VehicleStatsType) ?? [],
          }));
        }
      })
    );
  }

  fetchOperator(nocCode: string): Observable<OperatorLiveStatusFragment | null> {
    return this.operatorLiveStatusQuery.fetch({ nocCode }).pipe(
      map((res) => {
        const operator = res?.data?.operator ?? null;
        if (!operator && res?.errors) {
          throw new Error(res.errors.map(({ message }) => message).join(', '));
        }
        return operator;
      })
    );
  }

  fetchOperatorHistory(nocCode: string, date: DateTime): Observable<OperatorFeedHistoryFragment | null> {
    return this.operatorHistoricStatsQuery
      .fetch({
        nocCode,
        date: date.toISODate(),
        start: date.toUTC().startOf('day').toISO(),
        end: date.toUTC().endOf('day').toISO(),
      })
      .pipe(
        map((res) => {
          const operator = res?.data?.operator ?? null;
          if (!operator && res?.errors) {
            throw new Error(res.errors.map(({ message }) => message).join(', '));
          }
          return operator;
        })
      );
  }

  fetchAlerts(nocCode: string, start: DateTime, end: DateTime): Observable<EventType[] | null> {
    return this.eventsQuery.fetch({ nocCode, start: start.toUTC().toJSDate(), end: end.toUTC().toJSDate() }).pipe(
      map((res) => res?.data?.events?.items ?? null),
      catchError(() => of(null))
    );
  }

  fetchAlertStats(nocCode: string, end: DateTime, days = 90): Observable<EventStats[]> {
    return this.eventStatsQuery
      .fetch({
        nocCode,
        start: end.toUTC().startOf('day').minus({ days }).toJSDate(),
        end: end.toUTC().startOf('day').toJSDate(),
      })
      .pipe(map((res) => nonNullishArray(res?.data?.eventStats)));
  }
}
