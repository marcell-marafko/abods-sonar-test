import { Component, Input } from '@angular/core';
import { GDSSpacingSizes } from 'src/app/shared/types';

@Component({
  selector: 'gds-button',
  template: `
    <button
      [ngClass]="buttonClasses"
      data-module="govuk-button"
      [attr.aria-disabled]="disabled"
      [disabled]="disabled"
      [type]="type"
    >
      {{ text }}
    </button>
  `,
})
export class ButtonComponent {
  @Input() text?: string;
  @Input() disabled = false;
  @Input() appearance?: 'secondary' | 'warning';
  @Input() spaceBelow?: GDSSpacingSizes;
  @Input() spaceAbove?: GDSSpacingSizes;
  @Input() type: 'submit' | 'button' = 'button';

  get buttonClasses() {
    return {
      'govuk-button': true,
      [`govuk-button--${this.appearance}`]: this.appearance,
      'govuk-button--disabled': this.disabled,
      [`govuk-!-margin-bottom-${this.spaceBelow}`]: this.spaceBelow,
      [`govuk-!-margin-top-${this.spaceAbove}`]: this.spaceAbove,
    };
  }
}
