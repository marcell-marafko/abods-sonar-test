import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { FromTo } from '../components/date-range/date-range.types';

export enum Period {
  Last28 = 'last28',
  Last7 = 'last7',
  LastMonth = 'lastMonth',
  MonthToDate = 'monthToDate',
}

export interface WindowDatetimes {
  from: DateTime;
  to: DateTime;
  trendFrom: DateTime;
  trendTo: DateTime;
}

@Injectable({
  providedIn: 'root',
})
export class DateRangeService {
  calculatePresetPeriod(period: string, now: DateTime): WindowDatetimes {
    let to: DateTime = now.startOf('day');
    let from: DateTime;

    let trendTo: DateTime;
    let trendFrom: DateTime;

    switch (period) {
      case Period.Last7:
        from = to.minus({ days: 7 });
        trendTo = from;
        trendFrom = from.minus({ days: 7 });
        break;
      case Period.MonthToDate:
        // Ensure there is at least 1 day in the month:
        from = to.minus({ days: 1 }).startOf('month');
        trendFrom = from.minus({ months: 1 });
        trendTo = to.minus({ months: 1 });
        break;
      case Period.LastMonth:
        from = to.minus({ months: 1 }).startOf('month');
        to = from.plus({ months: 1 });
        trendTo = from;
        trendFrom = from.minus({ months: 1 });
        break;
      case Period.Last28:
      default:
        from = to.minus({ days: 28 });
        trendTo = from;
        trendFrom = from.minus({ days: 28 });
        break;
    }
    return { from, to, trendFrom, trendTo };
  }

  inverseLookup({ from, to }: FromTo, now: DateTime): 'last28' | 'last7' | 'lastMonth' | 'monthToDate' | 'custom' {
    if (!from?.isValid || !to?.isValid) {
      return 'custom';
    }

    if (now.hasSame(to, 'day')) {
      if (now.minus({ days: 28 }).hasSame(from, 'day')) {
        return 'last28';
      } else if (now.minus({ days: 7 }).hasSame(from, 'day')) {
        return 'last7';
      } else if (now.startOf('month').hasSame(from, 'day')) {
        return 'monthToDate';
      }
    } else if (
      from.plus({ months: 1 }).hasSame(to, 'day') &&
      now.minus({ months: 1 }).startOf('month').hasSame(from, 'day')
    ) {
      return 'lastMonth';
    }
    return 'custom';
  }
}
