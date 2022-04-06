import { ChangeDetectorRef, Component, forwardRef, HostListener } from '@angular/core';
import { FromTo } from './date-range.types';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateTime } from 'luxon';
import { DateRangeService } from '../../services/date-range.service';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeComponent),
      multi: true,
    },
  ],
})
export class DateRangeComponent implements ControlValueAccessor {
  value: FromTo = {};
  presetDateRange = 'last28';
  open = false;
  fromToStr = '';

  constructor(private dateRangeService: DateRangeService, private changeDetector: ChangeDetectorRef) {}

  onChange: (value: FromTo) => void = () => {
    // Do nothing
  };

  registerOnChange(fn: (value: FromTo) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(_fn: unknown): void {
    // Unused
  }

  writeValue(value: FromTo): void {
    this.value = value;
    this.setFromToStr(value);
    this.presetDateRange = this.dateRangeService.inverseLookup(value, DateTime.local());
    this.changeDetector.detectChanges();
  }

  private setFromToStr(fromTo: FromTo) {
    const { from, to } = fromTo;
    if (from && to) {
      this.fromToStr = `${from.toFormat('dd MMM yyyy')} - ${to.minus({ days: 1 }).toFormat('dd MMM yyyy')}`;
    }
  }

  openControls() {
    this.open = true;
  }

  @HostListener('document:keydown.escape')
  closeControls() {
    this.open = false;
  }

  toggleControls(event: Event) {
    event.preventDefault();
    this.open = !this.open;
  }

  preventKeystroke(event: Event) {
    event.returnValue = false;
    event.preventDefault();
  }

  pickDateRange(value: FromTo) {
    this.onChange(value);
    this.setFromToStr(value);
    this.presetDateRange = this.dateRangeService.inverseLookup(this.value, DateTime.local());
  }

  selectPresetDateRange(preset: string) {
    this.presetDateRange = preset;
    if (preset !== 'custom') {
      const { from, to } = this.dateRangeService.calculatePresetPeriod(this.presetDateRange, DateTime.local());
      this.value = { from, to };
      this.onChange(this.value);
      this.setFromToStr(this.value);
    }
  }
}
