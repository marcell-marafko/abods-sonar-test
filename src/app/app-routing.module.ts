import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { NotAuthorisedComponent } from './not-authorised/not-authorised.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
  relativeLinkResolution: 'legacy',
};

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'feed-monitoring',
    loadChildren: () => import('./feed-monitoring/feed-monitoring.module').then((mod) => mod.FeedMonitoringModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((mod) => mod.DashboardModule),
  },
  {
    path: 'organisation',
    loadChildren: () => import('./organisation/organisation.module').then((mod) => mod.OrganisationModule),
  },
  {
    path: 'on-time',
    loadChildren: () => import('./on-time/on-time.module').then((mod) => mod.OnTimeModule),
  },
  {
    path: 'corridors',
    loadChildren: () => import('./corridors/corridors.module').then((mod) => mod.CorridorsModule),
  },
  {
    path: 'geography',
    redirectTo: 'corridors',
  },
  { path: 'not-authorised', component: NotAuthorisedComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
