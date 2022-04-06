import { CorridorsModule } from '../corridors.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { CorridorsService } from '../corridors.service';
import { of } from 'rxjs';
import { CorridorsGridComponent } from './corridors-grid.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CorridorsGridComponent', () => {
  let spectator: Spectator<CorridorsGridComponent>;
  let component: CorridorsGridComponent;
  let service: CorridorsService;

  const createComponent = createComponentFactory({
    component: CorridorsGridComponent,
    imports: [CorridorsModule, SharedModule, LayoutModule, RouterTestingModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    service = spectator.inject(CorridorsService);
    spectator.detectChanges();
  });

  it('should fetch corridors', () => {
    const spy = spyOn(service, 'fetchCorridors').and.returnValue(
      of([{ id: 1, name: 'My test corridor', numStops: 3 }])
    );

    component.ngOnInit();
    spectator.detectChanges();

    expect(spy).toHaveBeenCalledWith();

    // TODO testing ag-grid isn't very easy
    const cellContent = spectator.query('[role="row"][row-index="0"] [role="gridcell"][col-id="numStops"]')
      ?.textContent;

    expect(cellContent).toEqual('3');
  });
});
