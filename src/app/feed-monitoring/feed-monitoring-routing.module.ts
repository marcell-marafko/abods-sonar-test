import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../authentication/auth-guard.service';
import { FeedMonitoringComponent } from './feed-monitoring.component';
import { FeedHistoryComponent } from './feed-history/feed-history.component';
import { LiveStatusComponent } from './live-status/live-status.component';

export const FeedMonitoringRoutes: Routes = [
  {
    path: '',

    canActivateChild: [AuthGuardService],

    children: [
      {
        path: '',
        component: FeedMonitoringComponent,
      },
      {
        path: ':nocCode',
        component: LiveStatusComponent,
      },
      {
        path: ':nocCode/feed-history',
        component: FeedHistoryComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(FeedMonitoringRoutes)],
  exports: [RouterModule],
})
export class FeedMonitoringRoutingModule {}
