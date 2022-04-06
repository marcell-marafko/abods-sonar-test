import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { DateRangeComponent } from './date-range.component';

describe('DateRangeComponent', () => {
  let spectator: Spectator<DateRangeComponent>;
  const createComponent = createComponentFactory(DateRangeComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
