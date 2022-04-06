import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { NgxTippyProps } from 'ngx-tippy-wrapper';
import { Stop } from '../corridors.service';
import { slice, tail, zip } from 'lodash-es';

export const pairwise = <T>(arr: T[]): [T, T][] => zip(slice(arr, 0, -1), tail(arr)) as [T, T][];

@Component({
  selector: 'app-segment-selector',
  templateUrl: './segment-selector.component.html',
  styleUrls: ['./segment-selector.component.scss'],
})
export class SegmentSelectorComponent implements OnChanges {
  @Input() stops?: Stop[];
  @Output() selectSegment = new EventEmitter<[Stop, Stop] | []>();
  @Output() deselectSegment = new EventEmitter<[Stop, Stop] | []>();
  @Output() mouseEnterStop = new EventEmitter<Stop>();
  @Output() mouseLeaveStop = new EventEmitter<Stop>();

  selected?: [Stop, Stop];
  segments?: [Stop, Stop][];

  tippyProps: NgxTippyProps = {
    allowHTML: true,
    theme: 'gds-tooltip',
    zIndex: 100,
    placement: 'bottom',
  };

  ngOnChanges() {
    this.segments = pairwise(this.stops ?? []);
  }

  onSelect(segment?: [Stop, Stop]) {
    this.deselectSegment.next(this.selected ?? []);
    this.selected = segment;
    this.selectSegment.emit(segment ?? []);
  }
}
