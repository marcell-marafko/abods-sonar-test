import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../authentication/auth-guard.service';
import { UsersComponent } from './users/users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AlertsComponent } from './alerts/alerts.component';

export const OrganisationRoutes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuardService],

    children: [
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'users/edit/:email',
        component: EditUserComponent,
        canActivate: [AuthGuardService],
        data: { roles: ['Administrator'] },
      },
      {
        path: 'alerts',
        component: AlertsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(OrganisationRoutes)],
  exports: [RouterModule],
})
export class OrganisationRoutingModule {}
