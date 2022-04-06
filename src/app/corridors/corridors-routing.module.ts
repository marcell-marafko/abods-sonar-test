import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../authentication/auth-guard.service';
import { CorridorsComponent } from './corridors.component';
import { CreateCorridorComponent } from './create/create-corridor.component';
import { ViewCorridorComponent } from './view/view-corridor.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuardService],
    children: [
      { path: '', component: CorridorsComponent },
      { path: 'create', component: CreateCorridorComponent },
      { path: ':corridorId', component: ViewCorridorComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorridorsRoutingModule {}
