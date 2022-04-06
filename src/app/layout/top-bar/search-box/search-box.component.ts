import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextUniqueId = 0;

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchBoxComponent),
      multi: true,
    },
  ],
})
export class SearchBoxComponent implements ControlValueAccessor {
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }

  get value(): string {
    return this.input;
  }

  set value(v: string) {
    if (v !== this.input) {
      this.input = v;
      this.onChange(v);
    }
  }

  protected _uid = `gds-search-${nextUniqueId++}`;
  input = '';
  protected _id = '';

  onChange: (_: unknown) => void = () => {
    // Do nothing
  };

  writeValue(value: string) {
    if (value !== this.input) {
      this.input = value;
    }
  }

  registerOnChange(fn: (_: unknown) => any) {
    this.onChange = fn;
  }

  registerOnTouched(_fn: (_: unknown) => any) {
    // Unused
  }
}
