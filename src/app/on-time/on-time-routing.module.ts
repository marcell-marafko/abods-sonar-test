import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../authentication/auth-guard.service';
import { OnTimeComponent } from './on-time.component';
import { StopsGridComponent } from './stops-grid/stops-grid.component';
import { ServiceGridComponent } from './service-grid/service-grid.component';
import { OperatorGridComponent } from './operator-grid/operator-grid.component';
import { SingleOperatorGuardService } from './single-operator-guard.service';

const routes: Routes = [
  {
    path: '',
    component: OnTimeComponent,
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: OperatorGridComponent,
        canActivate: [SingleOperatorGuardService],
      },
      {
        path: ':nocCode',
        component: ServiceGridComponent,
      },
      {
        path: ':nocCode/:lineId',
        component: StopsGridComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnTimeRoutingModule {}
