import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { DateRangeService } from '../shared/services/date-range.service';

@Component({
  templateUrl: './corridors.component.html',
  styleUrls: ['./corridors.component.scss'],
})
export class CorridorsComponent {
  dateRange = new FormControl(this.dateRangeService.calculatePresetPeriod('last28', DateTime.local()));

  constructor(private dateRangeService: DateRangeService) {}
}
