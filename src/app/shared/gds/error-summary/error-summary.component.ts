import { Component, Input } from '@angular/core';

export const asFormErrors: (err: unknown) => FormErrors[] = (err) =>
  !err ? [] : Array.isArray(err) ? err.map((e) => ({ error: String(e) })) : [{ error: String(err) }];

export interface FormErrors {
  error: string;
  label?: string;
}

@Component({
  selector: 'gds-error-summary',
  template: `
    <div
      *ngIf="errors.length > 0"
      class="govuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabindex="-1"
      data-module="govuk-error-summary"
    >
      <h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem.</h2>
      <div class="govuk-error-summary__body">
        <ul class="govuk-list govuk-error-summary__list">
          <li *ngFor="let error of errors">
            <a *ngIf="error.label; else summary" routerLink="./" [fragment]="error.label" [skipLocationChange]="true">{{
              error.error
            }}</a>
            <ng-template #summary
              ><span>{{ error.error }}</span></ng-template
            >
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [],
})
export class ErrorSummaryComponent {
  @Input() errors: FormErrors[] = [];
}
