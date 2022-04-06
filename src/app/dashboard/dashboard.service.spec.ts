import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let spectator: SpectatorService<DashboardService>;
  const createService = createServiceFactory(DashboardService);

  beforeEach(() => (spectator = createService()));

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});
