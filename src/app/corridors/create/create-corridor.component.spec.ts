import { CreateCorridorComponent } from './create-corridor.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { MockModule } from 'ng-mocks';
import { CorridorsModule } from '../corridors.module';
import { byLabel, byText, createComponentFactory, Spectator } from '@ngneat/spectator';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CorridorsService } from '../corridors.service';
import { of, throwError } from 'rxjs';
import { fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';

const testStop1 = { stopId: 'ST012345', naptan: '012345', stopName: 'Station Road', lat: 50, lon: 0, intId: 0 };
const testStop2 = { stopId: 'ST023456', naptan: '023456', stopName: 'High Street', lat: 51, lon: 0, intId: 1 };

describe('CreateCorridorComponent', () => {
  let spectator: Spectator<CreateCorridorComponent>;
  let service: CorridorsService;
  let router: Router;

  const createComponent = createComponentFactory({
    component: CreateCorridorComponent,
    imports: [CorridorsModule, SharedModule, LayoutModule, RouterTestingModule, ScrollingModule],
    overrideModules: [
      [
        CorridorsModule,
        { remove: { imports: [NgxMapboxGLModule] }, add: { imports: [MockModule(NgxMapboxGLModule)] } },
      ],
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    service = spectator.inject(CorridorsService);
    router = spectator.inject(Router);
    spectator.detectChanges();
  });

  it(
    'should search for stops',
    waitForAsync(() => {
      const spy = spyOn(service, 'queryStops').and.returnValue(of([testStop1]));

      spectator.typeInElement('station', byLabel('Search for the first stop in the corridor'));
      spectator.fixture.autoDetectChanges();

      spectator.fixture.whenStable().then(() => {
        expect(spy).toHaveBeenCalledWith('station');
        expect(spectator.component.matchingStops?.features?.length).toEqual(1);
        expect(spectator.query(byText('Station Road'))).toBeVisible();
      });
    })
  );

  it(
    'should set loading to false and noData to true if api call errors',
    waitForAsync(() => {
      const spy = spyOn(service, 'queryStops').and.returnValue(throwError('error'));

      spectator.typeInElement('station', byLabel('Search for the first stop in the corridor'));
      spectator.fixture.autoDetectChanges();

      spectator.fixture.whenStable().then(() => {
        expect(spy).toHaveBeenCalledWith('station');
        expect(spectator.component.noData).toBeTrue();
        expect(spectator.component.loading).toBeFalse();
      });
    })
  );

  it(
    'should find additional stops',
    waitForAsync(() => {
      const spy = spyOn(service, 'fetchSubsequentStops').and.returnValue(of([testStop2]));

      spectator.component.setStopList([testStop1]);
      spectator.detectChanges();

      spectator.fixture.whenStable().then(() => {
        spectator.detectChanges();
        expect(spy).toHaveBeenCalledWith(['ST012345']);
        expect(spectator.component.matchingStops?.features?.length).toEqual(1);
        expect(spectator.query(byText('High Street'))).toBeVisible();
      });
    })
  );

  it('should save corridor', fakeAsync(() => {
    spyOn(service, 'fetchSubsequentStops').and.returnValue(of([]));
    const serviceSpy = spyOn(service, 'createCorridor').and.returnValue(of(void 0));
    const routerSpy = spyOn(router, 'navigate');

    spectator.component.setStopList([testStop1, testStop2]);
    spectator.typeInElement('test corridor', byLabel('Enter a corridor name'));
    tick();
    spectator.detectChanges();

    spectator.click(byText('Finish'));
    tick();
    spectator.detectChanges();

    expect(serviceSpy).toHaveBeenCalledWith('test corridor', ['ST012345', 'ST023456']);
    expect(routerSpy).toHaveBeenCalledWith(['/corridors']);
  }));

  it('should prevent duplicate submissions', fakeAsync(() => {
    spyOn(service, 'fetchSubsequentStops').and.returnValue(of([]));
    const serviceSpy = spyOn(service, 'createCorridor').and.returnValue(of(void 0));
    const routerSpy = spyOn(router, 'navigate');

    spectator.component.setStopList([testStop1, testStop2]);
    spectator.typeInElement('duplicate corridor', byLabel('Enter a corridor name'));
    tick();
    spectator.detectChanges();

    for (let i = 0; i < 10; i++) {
      spectator.click(byText('Finish'));
      tick();
      spectator.detectChanges();
    }

    expect(serviceSpy).toHaveBeenCalledOnceWith('duplicate corridor', ['ST012345', 'ST023456']);
    expect(routerSpy).toHaveBeenCalledTimes(1);
  }));
});
