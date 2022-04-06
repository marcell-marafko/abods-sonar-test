import { RouterTestingModule } from '@angular/router/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { SharedModule } from '../../shared.module';

import { RangeSliderComponent } from './range-slider.component';

describe('SliderComponent', () => {
  let spectator: Spectator<RangeSliderComponent>;
  const createComponent = createComponentFactory({
    component: RangeSliderComponent,
    imports: [SharedModule, RouterTestingModule],
    detectChanges: false,
  });

  it('should create', () => {
    spectator = createComponent();

    const component = spectator.component;

    component.min = 0;
    component.max = 10;

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();
  });
});
