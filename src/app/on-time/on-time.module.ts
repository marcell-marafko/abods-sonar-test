import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, PercentPipe } from '@angular/common';
import { OnTimeRoutingModule } from './on-time-routing.module';
import { OnTimeComponent } from './on-time.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutModule } from '../layout/layout.module';
import { DelayFrequencyChartComponent } from './delay-frequency-chart/delay-frequency-chart.component';
import { TimeSeriesChartComponent } from './time-series-chart/time-series-chart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltersComponent } from './filters/filters.component';
import { OverviewStatsComponent } from './overview-stats/overview-stats.component';
import { StackedHistogramChartComponent } from './stacked-histogram-chart/stacked-histogram-chart.component';
import { OnTimeGridComponent } from './on-time-grid/on-time-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { TimeOfDayChartComponent } from './time-of-day-chart/time-of-day-chart.component';
import { DayOfWeekChartComponent } from './day-of-week-chart/day-of-week-chart.component';
import { StopsGridComponent } from './stops-grid/stops-grid.component';
import { TimingRendererComponent } from './stops-grid/timing-renderer/timing-renderer.component';
import { NoRowsOverlayComponent } from '../shared/components/ag-grid/no-rows-overlay/no-rows-overlay.component';
import { OperatorGridComponent } from './operator-grid/operator-grid.component';
import { RouterLinkCellRendererComponent } from '../shared/components/ag-grid/router-link-cell/router-link-cell.component';
import { SparklineFactoryComponent } from './operator-grid/sparkline-factory/sparkline-factory.component';
import { SparklineCellRendererComponent } from './operator-grid/sparkline-cell/sparkline-cell-renderer.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { ServiceMapComponent } from './service-map/service-map.component';
import { ChartNoDataWrapperComponent } from './chart-no-data-wrapper/chart-no-data-wrapper.component';
import { ExcessWaitTimeChartComponent } from './excess-wait-time-chart/excess-wait-time-chart.component';
import { ServiceGridComponent } from './service-grid/service-grid.component';
import { LuxonModule } from 'luxon-angular';

@NgModule({
  declarations: [
    OnTimeComponent,
    DelayFrequencyChartComponent,
    TimeSeriesChartComponent,
    OverviewStatsComponent,
    FiltersComponent,
    DayOfWeekChartComponent,
    TimeOfDayChartComponent,
    StackedHistogramChartComponent,
    TimeSeriesChartComponent,
    OverviewStatsComponent,
    OnTimeGridComponent,
    StopsGridComponent,
    TimingRendererComponent,
    OperatorGridComponent,
    SparklineFactoryComponent,
    SparklineCellRendererComponent,
    ServiceMapComponent,
    ChartNoDataWrapperComponent,
    ExcessWaitTimeChartComponent,
    ServiceGridComponent,
  ],
  providers: [PercentPipe, DecimalPipe],
  imports: [
    CommonModule,
    OnTimeRoutingModule,
    LayoutModule,
    SharedModule,
    FormsModule,
    AgGridModule.withComponents([NoRowsOverlayComponent, RouterLinkCellRendererComponent]),
    NgxMapboxGLModule,
    ReactiveFormsModule,
    LuxonModule,
  ],
  exports: [OnTimeComponent, ServiceGridComponent, StopsGridComponent, OperatorGridComponent],
})
export class OnTimeModule {}
