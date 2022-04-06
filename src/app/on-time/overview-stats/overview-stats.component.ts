import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PunctualityOverview } from '../on-time.service';
import { Headway } from '../headway.service';

const NO_REALTIME_DATA_TOOLTIP_TEXT = 'No real-time data available.';
const NO_TIMETABLE_DATA_TOOLTIP_TEXT = 'No scheduled stop departures found for the selected date range and filters.';

@Component({
  selector: 'app-overview-stats',
  templateUrl: './overview-stats.component.html',
  styleUrls: ['./overview-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewStatsComponent {
  @Input() showTotal = false;
  @Input() overview?: PunctualityOverview;
  @Input() frequent = false;
  @Input() headwayOverview?: Headway;
  @Input() loading = true;

  constructor(private numberPipe: DecimalPipe) {}

  get onTime(): number {
    return this.overview?.onTime ?? NaN;
  }

  get late(): number {
    return this.overview?.late ?? NaN;
  }

  get early(): number {
    return this.overview?.early ?? NaN;
  }

  get completed(): number {
    return this.overview?.completed ?? NaN;
  }

  get scheduled(): number {
    return this.overview?.scheduled ?? NaN;
  }

  get noData(): number {
    return this.overview?.noData ?? NaN;
  }

  /*
   * TODO:
   * Ideally these should be templated in the html - but we can't pass templates to the tooltip
   * as it stands. If we upgrade to Angular 12 we can have ngx-tippy-wrapper 4 which does support
   * passing a TemplateRef for the tooltip content. (The other option would be to roll our own tooltips,
   * but I'm not going to do that here).
   */
  get onTimeTooltipText(): string {
    if (this.overview && this.overview?.completed) {
      return `${this.numberPipe.transform(this.overview.onTime)} of ${this.numberPipe.transform(
        this.overview.completed
      )} recorded stop departures were between 1 minute early and 5 minutes 59 seconds late.`;
    }
    return NO_REALTIME_DATA_TOOLTIP_TEXT;
  }

  get earlyTooltipText(): string {
    if (this.overview && this.overview?.completed) {
      return `${this.numberPipe.transform(this.overview.early)} of ${this.numberPipe.transform(
        this.overview.completed
      )} recorded stop departures were more than 1 minute early.`;
    }
    return NO_REALTIME_DATA_TOOLTIP_TEXT;
  }

  get lateTooltipText(): string {
    if (this.overview && this.overview?.completed) {
      return `${this.numberPipe.transform(this.overview.late)} of ${this.numberPipe.transform(
        this.overview.completed
      )} recorded stop departures were more than 5 minutes 59 seconds late.`;
    }
    return NO_REALTIME_DATA_TOOLTIP_TEXT;
  }

  get noDataTooltipText(): string {
    if (this.overview && this.overview?.scheduled) {
      return `${this.numberPipe.transform(this.overview.noData)} of ${this.numberPipe.transform(
        this.overview.scheduled
      )} scheduled stop departures have no corresponding real-time data.`;
    }
    return NO_TIMETABLE_DATA_TOOLTIP_TEXT;
  }
}
