import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { SharedModule } from '../../shared/shared.module';
import { JourneyTimeChartComponent } from './journey-time-chart.component';

describe('JourneyTimeChartComponent', () => {
  let spectator: Spectator<JourneyTimeChartComponent>;

  const createComponent = createComponentFactory({
    component: JourneyTimeChartComponent,
    imports: [SharedModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
