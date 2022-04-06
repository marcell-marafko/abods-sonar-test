import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetComponent } from './fieldset/fieldset.component';
import { TextInputComponent } from './text-input/text-input.component';
import { ButtonComponent } from './button/button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorSummaryComponent } from './error-summary/error-summary.component';
import { RouterModule } from '@angular/router';
import { BackLinkComponent } from './back-link/back-link.component';
import { PanelComponent } from './panel/panel.component';
import { RadiosComponent } from './radios/radios.component';
import { RadioItemComponent } from './radios/radio-item/radio-item.component';
import { SelectComponent } from './select/select.component';
import { NotificationBannerComponent } from './notification-banner/notification-banner.component';
import { RadioConditionalComponent } from './radios/radio-conditional/radio-conditional.component';
import { CheckboxesComponent } from './checkboxes/checkboxes.component';
import { CheckboxesItemComponent } from './checkboxes/checkboxes-item/checkboxes-item.component';
import { ButtonDirective } from './button/button.directive';

@NgModule({
  declarations: [
    FieldsetComponent,
    TextInputComponent,
    ButtonComponent,
    ButtonDirective,
    ErrorSummaryComponent,
    BackLinkComponent,
    PanelComponent,
    RadiosComponent,
    RadioItemComponent,
    RadioConditionalComponent,
    SelectComponent,
    NotificationBannerComponent,
    CheckboxesComponent,
    CheckboxesItemComponent,
  ],
  imports: [RouterModule, FormsModule, CommonModule, ReactiveFormsModule],
  exports: [
    FieldsetComponent,
    TextInputComponent,
    ButtonComponent,
    ButtonDirective,
    ErrorSummaryComponent,
    BackLinkComponent,
    PanelComponent,
    RadiosComponent,
    RadioItemComponent,
    RadioConditionalComponent,
    SelectComponent,
    NotificationBannerComponent,
    CheckboxesComponent,
    CheckboxesItemComponent,
  ],
})
export class GdsModule {}
