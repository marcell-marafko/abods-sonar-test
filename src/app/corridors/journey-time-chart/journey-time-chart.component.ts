import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { XYChart } from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { Rectangle } from '@amcharts/amcharts4/core';
import { chartColors, loadingSpinner, messageScreen } from '../../shared/components/amcharts/chart.service';
import { CorridorStatsViewParams } from '../corridors.service';

@Component({
  selector: 'app-journey-time-chart',
  template: `<am4-xy-chart class="chart" [data]="data"></am4-xy-chart> `,
  styles: ['.chart { height: 440px; }'],
})
export class JourneyTimeChartComponent implements AfterViewInit, OnChanges {
  @Input() data?: unknown[];
  @Input() loading?: boolean;
  @Input() noData = false;
  @Input() params?: CorridorStatsViewParams;
  @Input() centerAxis = false;
  @Input() dataField?: string;
  @Input() variant: 'date' | 'category' | 'histogram' = 'date';
  @Input() labelStyle: 'bin' | 'column' = 'column';
  @Input() show75PercentileInTooltip = true;

  @ViewChild(XYChart) chart!: XYChart;

  private xAxis?: am4charts.DateAxis;
  whiskerSeries?: am4charts.ColumnSeries;

  private loadingScreen?: am4core.Container;
  private noDataScreen?: am4core.Container;

  darkerTurquoise = am4core.color('#1D766F');

  private setParams(params: CorridorStatsViewParams) {
    if (!this.xAxis) {
      return;
    }

    this.xAxis.min = params.from.toMillis();
    this.xAxis.max = params.to.minus({ [params.granularity]: 1 }).toMillis();

    this.xAxis.baseInterval = {
      timeUnit: params.granularity as am4core.TimeUnit,
      count: 1,
    };
    const gridIntervals: am4core.ITimeInterval[] =
      params.granularity === 'hour'
        ? [
            { timeUnit: 'hour', count: 1 },
            { timeUnit: 'hour', count: 3 },
            { timeUnit: 'hour', count: 6 },
          ]
        : [
            { timeUnit: 'day', count: 1 },
            { timeUnit: 'day', count: 2 },
            { timeUnit: 'day', count: 7 },
          ];
    this.xAxis.gridIntervals.setAll(gridIntervals);

    if (this.whiskerSeries) {
      this.whiskerSeries.columns.template.tooltipHTML = this.whiskerTooltipHtml();
    }
  }

  ngAfterViewInit() {
    this.chart.paddingRight = 20;
    this.chart.dateFormatter.inputDateFormat = 'yyyy-MM-ddTHH:mm:ss';
    this.chart.durationFormatter.durationFormat = 'm:ss';
    this.chart.zoomOutButton.disabled = true;

    let xAxis;
    if (this.variant === 'date') {
      xAxis = this.xAxis = this.chart.xAxes.push(new am4charts.DateAxis());
      xAxis.renderer.grid.template.location = 0.5;
    } else {
      xAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
      xAxis.dataFields.category = this.dataField ?? 'category';
      if (this.variant === 'histogram') {
        xAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.cellStartLocation = 0.2;
        xAxis.renderer.cellEndLocation = 0.8;
        xAxis.title.text = 'Journey time';
      }
    }

    if (this.labelStyle === 'bin') {
      xAxis.endLocation = 0.05; // Deliberately cut off last cell
    }

    xAxis.renderer.minGridDistance = 40;
    xAxis.renderer.line.strokeOpacity = this.variant === 'histogram' || this.centerAxis ? 0 : 0.15;

    if (this.centerAxis) {
      xAxis.width = am4core.percent(45);
      xAxis.align = 'center';

      const dummyAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
      dummyAxis.renderer.inside = true;
      dummyAxis.renderer.line.strokeOpacity = 0.15;
    }

    if (this.params) {
      this.setParams(this.params);
    }

    const xAxisLabel = xAxis.renderer.labels.template;
    xAxisLabel.fontSize = 13;
    xAxisLabel.maxWidth = 45;
    xAxisLabel.location = this.labelStyle === 'bin' ? 0 : 0.5;
    xAxisLabel.textAlign = 'middle';
    xAxisLabel.fill = chartColors.legendaryGrey;

    let yAxis;
    if (this.variant === 'histogram') {
      yAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.renderer.line.strokeOpacity = 0.15;
      yAxis.renderer.minGridDistance = 30;
      yAxis.renderer.minLabelPosition = 0.05;

      yAxis.maxPrecision = 0;
      yAxis.title.text = 'Number of journeys';
    } else {
      yAxis = this.chart.yAxes.push(new am4charts.DurationAxis());
      yAxis.renderer.grid.template.disabled = true;
    }

    yAxis.renderer.baseGrid.disabled = false;

    const yAxisLabel = yAxis.renderer.labels.template;
    yAxisLabel.fontSize = 13;
    yAxisLabel.maxWidth = 40;
    yAxisLabel.fill = chartColors.legendaryGrey;

    if (this.variant === 'histogram') {
      const columnSeries = this.chart.series.push(new am4charts.ColumnSeries());
      columnSeries.dataFields.categoryX = this.dataField;
      columnSeries.dataFields.valueY = 'freq';
      columnSeries.fill = chartColors.turquoise;

      const cursor = new am4charts.XYCursor();
      cursor.behavior = 'none';
      cursor.lineY.disabled = true;
      cursor.lineX.disabled = true;
      cursor.snapToSeries = columnSeries;
      this.chart.cursor = cursor;

      if (yAxis.tooltip) yAxis.tooltip.disabled = true;
      if (xAxis.tooltip) xAxis.tooltip.disabled = true;

      columnSeries.columns.template.tooltipHTML = `<div style="margin-bottom: 5px;">{duration}</div>
      <div style="margin-bottom: 5px;"><b>{freq} journeys</b></div>`;

      if (columnSeries.tooltip) {
        columnSeries.tooltip.pointerOrientation = 'vertical';
        columnSeries.tooltip.getFillFromObject = false;
        columnSeries.tooltip.label.fill = chartColors.black;
        columnSeries.tooltip.label.padding(10, 10, 5, 10);
        columnSeries.tooltip.background.cornerRadius = 0;

        columnSeries.tooltip.background.filters.clear();
        columnSeries.tooltip.background.fillOpacity = 1;
        columnSeries.tooltip.background.fill = chartColors.white;
        columnSeries.tooltip.background.stroke = chartColors.black;
      }
    } else {
      this.createBoxPlotSeries();
    }

    if (yAxis.tooltip) yAxis.tooltip.disabled = true;
    if (xAxis.tooltip) xAxis.tooltip.disabled = true;

    this.loadingScreen = this.chart?.tooltipContainer?.createChild(am4core.Container);
    if (this.loadingScreen) {
      loadingSpinner(this.loadingScreen);
      this.loading ? this.loadingScreen?.show(0) : this.loadingScreen?.hide(0);
    }

    this.noDataScreen = this.chart?.tooltipContainer?.createChild(am4core.Container);
    if (this.noDataScreen) {
      messageScreen(this.noDataScreen, 'warn', 'No data');
      this.noData ? this.noDataScreen?.show(0) : this.noDataScreen?.hide(0);
    }
  }

  createBoxPlotSeries() {
    const type = this.variant === 'category' ? 'categoryX' : 'dateX';

    const dataField = this.variant === 'category' ? 'category' : 'ts';

    const whiskerSeries = this.chart.series.push(new am4charts.ColumnSeries());
    whiskerSeries.dataFields[type] = dataField;
    whiskerSeries.dataFields.valueY = 'maxTransitTime';
    whiskerSeries.dataFields.openValueY = 'minTransitTime';
    whiskerSeries.clustered = false;
    whiskerSeries.columns.template.width = 2;
    whiskerSeries.strokeWidth = 0;
    whiskerSeries.fill = this.darkerTurquoise;
    whiskerSeries.columns.template.readerTitle = `{${type}} Min transit time: {openValueY}, Max transit time: {valueY}`;

    const makeLine = (bullet: am4charts.Bullet) => {
      const rect = bullet.createChild(Rectangle);
      rect.width = 10;
      rect.height = 2;
      rect.horizontalCenter = 'middle';
      rect.verticalCenter = 'middle';
      rect.strokeWidth = 0;
      return rect;
    };

    const maxBullet = whiskerSeries.bullets.push(new am4charts.Bullet());
    maxBullet.locationY = 1;
    makeLine(maxBullet);

    const minBullet = whiskerSeries.bullets.push(new am4charts.Bullet());
    minBullet.locationY = 0;
    makeLine(minBullet);

    const boxSeries = this.chart.series.push(new am4charts.ColumnSeries());
    boxSeries.dataFields[type] = dataField;
    boxSeries.dataFields.valueY = 'percentile75';
    boxSeries.dataFields.openValueY = 'percentile25';
    boxSeries.clustered = false;
    boxSeries.columns.template.width = 10;
    boxSeries.strokeWidth = 0;
    boxSeries.fill = chartColors.turquoise;
    boxSeries.columns.template.readerTitle = `{${type}} 1st quartile transit time: {openValueY}, 3rd quartile transit time: {valueY}`;

    const meanSeries = this.chart.series.push(new am4charts.ColumnSeries());
    meanSeries.dataFields[type] = dataField;
    meanSeries.dataFields.valueY = 'avgTransitTime';
    meanSeries.clustered = false;
    meanSeries.fillOpacity = 0;
    meanSeries.strokeWidth = 0;
    meanSeries.fill = this.darkerTurquoise;
    meanSeries.columns.template.readerTitle = `{${type}} Mean transit time: {valueY}`;

    const meanBullet = meanSeries.bullets.push(new am4charts.Bullet());
    meanBullet.fillOpacity = 1;
    makeLine(meanBullet);

    const cursor = new am4charts.XYCursor();
    cursor.behavior = 'none';
    cursor.lineY.disabled = true;
    cursor.lineX.disabled = true;
    this.chart.cursor = cursor;

    whiskerSeries.columns.template.tooltipHTML = this.whiskerTooltipHtml();

    if (whiskerSeries.tooltip) {
      whiskerSeries.tooltip.pointerOrientation = 'vertical';
      whiskerSeries.tooltip.getFillFromObject = false;
      whiskerSeries.tooltip.label.fill = chartColors.black;
      whiskerSeries.tooltip.label.padding(10, 10, 5, 10);
      whiskerSeries.tooltip.background.cornerRadius = 0;

      whiskerSeries.tooltip.background.filters.clear();
      whiskerSeries.tooltip.background.fillOpacity = 1;
      whiskerSeries.tooltip.background.fill = chartColors.white;
      whiskerSeries.tooltip.background.stroke = chartColors.black;
    }

    this.whiskerSeries = whiskerSeries;
  }

  private whiskerTooltipHtml() {
    let headingFormat: string;
    if (this.variant === 'date') {
      let dateFormat = 'EEE, MMM dd';
      if (this.params?.granularity === 'hour') {
        dateFormat = `HH:mm ${dateFormat}`;
      }
      headingFormat = `dateX.formatDate('${dateFormat}')`;
    } else {
      headingFormat = 'binLabel';
    }

    return `
      <header class="amcharts__tooltip-heading">{${headingFormat}}</header>
      <div class="amcharts__tooltip-table">
        <span>Mean</span>
        <span class="amcharts__tooltip-value">{avgTransitTime.formatDuration('m:ss')}</span>
        <span>Minimum</span>
        <span class="amcharts__tooltip-value">{minTransitTime.formatDuration('m:ss')}</span>
        <span>Maximum</span>
        <span class="amcharts__tooltip-value">{maxTransitTime.formatDuration('m:ss')}</span>
        ${
          this.show75PercentileInTooltip
            ? `
              <span>75th percentile</span>
              <span class="amcharts__tooltip-value">{percentile25.formatDuration('m:ss')} - {percentile75.formatDuration('mm:ss')}</span>`
            : ''
        }
      </div>`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.loading && this.loadingScreen) {
      changes.loading.currentValue ? this.loadingScreen?.show() : this.loadingScreen?.hide();
    }

    if (changes.noData && this.noDataScreen) {
      changes.noData.currentValue ? this.noDataScreen?.show() : this.noDataScreen?.hide();
    }

    if (changes.params) {
      this.setParams(changes.params.currentValue);
    }
  }
}
