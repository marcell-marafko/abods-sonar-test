import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorridorsRoutingModule } from './corridors-routing.module';
import { CorridorsComponent } from './corridors.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutModule } from '../layout/layout.module';
import { CreateCorridorComponent } from './create/create-corridor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { AgGridModule } from 'ag-grid-angular';
import { CorridorsGridComponent } from './grid/corridors-grid.component';
import { ViewCorridorComponent } from './view/view-corridor.component';
import { LuxonModule } from 'luxon-angular';
import { SegmentSelectorComponent } from './segment-selector/segment-selector.component';
import { JourneyTimeChartComponent } from './journey-time-chart/journey-time-chart.component';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    CorridorsComponent,
    CreateCorridorComponent,
    CorridorsGridComponent,
    ViewCorridorComponent,
    JourneyTimeChartComponent,
    SegmentSelectorComponent,
  ],
  imports: [
    CommonModule,
    CorridorsRoutingModule,
    LayoutModule,
    SharedModule,
    ReactiveFormsModule,
    NgxMapboxGLModule,
    AgGridModule,
    FormsModule,
    LuxonModule,
    NgxTippyModule,
    ScrollingModule,
  ],
  exports: [CorridorsComponent],
})
export class CorridorsModule {}
