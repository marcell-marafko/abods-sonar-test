import { AfterViewInit, Component, ElementRef, Input, OnDestroy } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { OnTimeService, PerformanceParams } from '../on-time.service';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { ChartService } from 'src/app/shared/components/amcharts/chart.service';
import { switchMap } from 'rxjs/operators';
import { PerformanceCategories } from '../../dashboard/dashboard.types';
import { AsyncStatus, withStatus } from '../pending.model';
import { BaseChart } from '../../shared/components/amcharts/base-chart';

@Component({
  selector: 'app-delay-frequency-chart',
  template: ``,
  styles: [],
})
export class DelayFrequencyChartComponent extends BaseChart implements AfterViewInit, OnDestroy {
  @Input()
  set params(value: PerformanceParams | null) {
    if (value) {
      this.params$.next(value);
    }
  }
  private params$ = new ReplaySubject<PerformanceParams>();
  status$ = new Subject<AsyncStatus>();

  legend = {
    [PerformanceCategories.OnTime]: {
      name: 'On-Time',
      hint: '',
      fill: this.chartService.colorMap.purple,
    },
    [PerformanceCategories.Late]: {
      name: 'Late',
      hint: '(> 5:59 minutes)',
      fill: this.chartService.colorMap.ochre,
    },
    [PerformanceCategories.Early]: {
      name: 'Early',
      hint: '(> 1 minute)',
      fill: this.chartService.colorMap.pink,
    },
  };
  heuristic = (time: number): PerformanceCategories => {
    if (time < -1) {
      return PerformanceCategories.Early;
    } else if (time < 6) {
      return PerformanceCategories.OnTime;
    } else {
      return PerformanceCategories.Late;
    }
  };

  constructor(private service: OnTimeService, private elementRef: ElementRef, chartService: ChartService) {
    super(am4themes_animated, chartService);
  }

  ngAfterViewInit(): void {
    this.chartService.browserOnly(() => this.renderChart());
    this.params$
      .pipe(switchMap((params) => withStatus(() => this.service.fetchOnTimeDelayFrequencyData(params), this.status$)))
      .subscribe((data) => (this.chart.data = data ?? []));
    this.status$.subscribe((status) => (this.asyncStatus = status));
  }

  createChart(): void {
    this.chart = am4core.create(this.elementRef.nativeElement, am4charts.XYChart);

    this.chart.padding(10, 10, 0, 0);
    this.chart.margin(0, 0, 0, 0);

    const categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.title.text = 'Performance against schedule';
    categoryAxis.dataFields.category = 'bucket';
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.fontSize = 13;
    categoryAxis.renderer.labels.template.fill = this.chartService.colorMap.legendaryGrey;
    categoryAxis.numberFormatter = new am4core.NumberFormatter();
    categoryAxis.numberFormatter.numberFormat = "'+'###|###|#";

    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Number of stops';
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.renderer.labels.template.fontSize = 13;
    valueAxis.renderer.labels.template.fill = this.chartService.colorMap.legendaryGrey;
    valueAxis.renderer.line.strokeOpacity = 0.15;

    const series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'frequency';
    series.dataFields.categoryX = 'bucket';
    series.columns.template.adapter.add('fill', (fill, target) => {
      const bucketValue = Number((target.dataItem as am4charts.ColumnSeriesDataItem).categoryX);
      return this.legend[this.heuristic(bucketValue)].fill;
    });
    series.strokeWidth = 0;

    const legend = (this.chart.legend = new am4charts.Legend());
    legend.position = 'bottom';
    legend.contentAlign = 'left';
    legend.itemContainers.template.togglable = false;
    legend.labels.template.text = `[bold]{name}[/] [${this.chartService.colorMap.legendaryGrey}]{hint}[/]`;
    legend.labels.template.fontSize = 16;
    legend.marginTop = 30;
    legend.itemContainers.template.paddingTop = 0;
    legend.itemContainers.template.paddingBottom = 0;
    legend.useDefaultMarker = false;
    legend.clickable = false;
    legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;

    const marker = legend.markers.template.children.getIndex(0) as am4core.RoundedRectangle;

    // reduce the legend marker size
    if (marker) {
      marker.cornerRadius(0, 0, 0, 0);
      marker.height = 15;
      marker.width = 15;
      marker.marginTop = 3;
      marker.valign = 'top';
    }

    legend.data = Object.values(this.legend);
  }

  ngOnDestroy(): void {
    this.params$.complete();
    this.status$.complete();
    this.chartService.browserOnly(() => {
      this.chart?.dispose();
    });
  }
}
