import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, pairwise, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RangeSliderComponent implements OnInit, OnDestroy {
  @Input() min!: number;
  @Input() max!: number;

  change = new Subject<[number, number]>();
  destroyed = new Subject();

  sliding = false;

  _value: [number, number] = [this.min, this.max];
  get value(): [number, number] {
    return this._value;
  }
  set value(val: [number, number]) {
    this.change.next(val);
  }

  @Input() set lower(val: number) {
    // Don't update value if user is sliding
    if (this.sliding) {
      return;
    }
    this._value = [val, this._value[1]];
  }
  @Output() lowerChange = new EventEmitter<number>();
  @Input() set upper(val: number) {
    // Don't update value if user is sliding
    if (this.sliding) {
      return;
    }
    this._value = [this._value[0], val];
  }
  @Output() upperChange = new EventEmitter<number>();

  ngOnInit(): void {
    this.change
      .pipe(debounceTime(1), startWith([NaN, NaN] as [number, number]), pairwise(), takeUntil(this.destroyed))
      .subscribe(([[oldLo, oldUp], [lo, up]]) => {
        if (oldLo !== lo) {
          this.lowerChange.emit(lo);
        }
        if (oldUp !== up) {
          this.upperChange.emit(up);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  startSlide() {
    this.sliding = true;
  }

  endSlide() {
    this.sliding = false;
  }
}
