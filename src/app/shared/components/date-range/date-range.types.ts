import { DateTime } from 'luxon';

export interface FromTo {
  from?: DateTime;
  to?: DateTime;
}

export interface Day {
  date: DateTime;
  isToday: boolean;
  isSelected: boolean;
  isSelectable: boolean;
  isVisible: boolean;
  isSaturday: boolean;
}
