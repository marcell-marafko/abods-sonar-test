import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateTime, Interval } from 'luxon';
import { Day } from './date-range.types';
import { DateRange } from './date-range-controls.component';

function* daysOf(interval: Interval) {
  let cursor = interval.start.startOf('day');
  while (cursor < interval.end) {
    yield cursor;
    cursor = cursor.plus({ days: 1 });
  }
}

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['date-range-controls.component.scss'],
})
export class CalendarComponent {
  @Output() dateChange = new EventEmitter<DateTime>();

  _selected: DateRange = {};
  selectedInterval?: Interval;
  leadingBlanks?: void[];
  days?: Day[];
  today = DateTime.local().startOf('day');
  dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  @Input()
  set selected(value: DateRange) {
    this._selected = value;
    this.selectedInterval =
      value.start?.isValid && value.end?.isValid ? Interval.fromDateTimes(value.start, value.end) : undefined;
  }

  @Input()
  set month(month: Interval) {
    this.leadingBlanks = Array(month.start.weekday - 1);
    this.days = Array.from(daysOf(month)).map((date) => ({
      date,
      isToday: date.equals(this.today),
      isSelectable: this.today >= date,
      isSelected: false,
      isVisible: true,
      isSaturday: date.weekday === 6,
    }));
  }
}
