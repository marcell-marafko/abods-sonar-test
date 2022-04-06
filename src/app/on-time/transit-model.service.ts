import { ServicePatternType, TransitModelServicePatternStopsGQL } from '../../generated/graphql';
import { map } from 'rxjs/operators';
import { isNotNullOrUndefined } from '../shared/rxjs-operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// TODO put these in the shared module
export type Definitely<T> = {
  [P in keyof T]-?: T[P] extends Array<infer I> ? NonNullable<I>[] : NonNullable<T[P]>;
};

export type NullishArray<T> = (T | null | undefined)[] | null | undefined;

export const nonNullishArray = <T>(array: NullishArray<T>): T[] => (array ?? []).filter(isNotNullOrUndefined);

export type ServicePattern = Definitely<Omit<ServicePatternType, '__typename'>>;

@Injectable({ providedIn: 'root' })
export class TransitModelService {
  constructor(private servicePatternStopsQuery: TransitModelServicePatternStopsGQL) {}

  fetchServicePatternStops(nocCode: string | null, lineId: string | null): Observable<ServicePattern[]> {
    return this.servicePatternStopsQuery
      .fetch({
        nocCode: nocCode ? nocCode : '',
        lineId: lineId ? lineId : '',
      })
      .pipe(
        map((result) => nonNullishArray(result.data?.operator?.transitModel?.lines?.items?.[0]?.servicePatterns)),
        map((patterns) =>
          patterns.map((pattern) => ({
            ...pattern,
            stops: nonNullishArray(pattern.stops),
          }))
        )
      );
  }
}
