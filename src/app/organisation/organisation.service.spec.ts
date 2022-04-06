import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { OrganisationService } from './organisation.service';

describe('OrganisationService', () => {
  let spectator: SpectatorService<OrganisationService>;
  const createService = createServiceFactory(OrganisationService);

  beforeEach(() => (spectator = createService()));

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});
