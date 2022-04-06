import { AfterViewInit, Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss'],
})
export class StatComponent<T> implements AfterViewInit {
  @Input() label?: string;
  @Input() statValue?: T;
  @Input() tooltip?: string;
  @Input() identifier?: string;
  @Input() statLoaded = true;
  @ContentChild('statTemplate') statTemplate?: TemplateRef<T>;
  @Input() statFormatter?: (t: T | undefined) => string;

  ngAfterViewInit(): void {
    if (this.statFormatter && this.statTemplate) {
      throw new Error('Either specify a formatter or a template, not both.');
    }
  }
}
