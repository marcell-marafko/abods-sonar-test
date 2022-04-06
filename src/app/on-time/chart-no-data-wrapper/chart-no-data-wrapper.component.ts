import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-no-data-wrapper',
  templateUrl: './chart-no-data-wrapper.component.html',
  styleUrls: ['./chart-no-data-wrapper.component.scss'],
})
export class ChartNoDataWrapperComponent {
  @Input() noData = false;
  @Input() dataExpected = false;
  @Input() timingPointsNotSupported = false;

  get errorMessage() {
    if (this.dataExpected) {
      return 'We have not received any vehicle location data for the time period and filters selected.';
    } else if (this.timingPointsNotSupported) {
      return 'The timing points filter is not supported for excess waiting time.';
    } else {
      return 'We have not found any timetable data for the time period and filters selected.';
    }
  }
}
