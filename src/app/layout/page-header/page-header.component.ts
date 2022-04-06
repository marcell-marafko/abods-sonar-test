import { Component, Input } from '@angular/core';
import { GDSSpacingSizes } from 'src/app/shared/types';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input() caption?: string;
  @Input() heading?: string;
  @Input() spaceAbove?: GDSSpacingSizes;
  @Input() spaceBelow?: GDSSpacingSizes = '8';

  get headerClasses() {
    return {
      [`govuk-!-margin-bottom-${this.spaceBelow}`]: this.spaceBelow,
      [`govuk-!-margin-top-${this.spaceAbove}`]: this.spaceAbove,
    };
  }
}
