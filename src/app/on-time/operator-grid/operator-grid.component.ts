import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ColDef, FilterChangedEvent, ICellRendererParams, PaginationChangedEvent } from 'ag-grid-community';
import { OnTimeService, OperatorPerformance, PerformanceParams } from '../on-time.service';
import { ParamsService } from '../params.service';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { from, of, Subject } from 'rxjs';
import { PercentPipe } from '@angular/common';
import { RouterLinkCellRendererComponent } from '../../shared/components/ag-grid/router-link-cell/router-link-cell.component';
import {
  NoRowsOverlayComponent,
  NoRowsOverlayParams,
} from '../../shared/components/ag-grid/no-rows-overlay/no-rows-overlay.component';
import { SparklineCellRendererComponent } from './sparkline-cell/sparkline-cell-renderer.component';
import { SparklineFactoryComponent } from './sparkline-factory/sparkline-factory.component';
import { SafeHtml } from '@angular/platform-browser';
import { DateTime, Interval } from 'luxon';
import { Granularity } from '../../../generated/graphql';
import { SelectableTextCellRendererComponent } from 'src/app/shared/components/ag-grid/selectable-text-cell/selectable-text-cell.component';

const INITIAL_NO_ROWS_MESSAGE = 'No operator data found';

@Component({
  templateUrl: 'operator-grid.component.html',
  styleUrls: ['./operator-grid.component.scss'],
})
export class OperatorGridComponent implements OnInit, OnDestroy {
  columnDefs: ColDef[] = [
    {
      field: 'nocCode',
      headerName: 'NOC',
      cellRendererFramework: SelectableTextCellRendererComponent,
      cellRendererParams: { noWrap: true, textOverflow: 'visible' },
      flex: 1,
      minWidth: 60,
      maxWidth: 90,
    },
    {
      field: 'name',
      headerName: 'Operator',
      cellRendererFramework: RouterLinkCellRendererComponent,
      cellRendererParams: { routerLinkGetter: (params: ICellRendererParams) => [params.data.nocCode], bold: true },
      flex: 2,
      minWidth: 200,
      getQuickFilterText: (params) => (params.value as string).replace(/[^\w]+/g, ''),
    },
    {
      field: 'onTimeRatio',
      valueFormatter: ({ value }) => this.percent.transform(value, '1.0-1') ?? '',
      headerName: 'On-time',
      sortable: true,
      unSortIcon: true,
      type: 'numericColumn',
      maxWidth: 130,
    },
    {
      field: 'lateRatio',
      valueFormatter: ({ value }) => this.percent.transform(value, '1.0-1') ?? '',
      headerName: 'Late',
      sortable: true,
      unSortIcon: true,
      type: 'numericColumn',
      flex: 1,
      maxWidth: 130,
    },
    {
      field: 'earlyRatio',
      valueFormatter: ({ value }) => this.percent.transform(value, '1.0-1') ?? '',
      headerName: 'Early',
      sortable: true,
      unSortIcon: true,
      type: 'numericColumn',
      flex: 1,
      maxWidth: 130,
    },
    {
      colId: 'sparkline',
      valueGetter: ({ data }) => this.sparklines[data.nocCode],
      flex: 3,
      minWidth: 350,
      maxWidth: 500,
      cellClass: 'ag-cell-last',
      cellRendererFramework: SparklineCellRendererComponent,
      cellStyle: { display: 'flex', justifyContent: 'flex-end' },
    },
  ];
  defaultColDef = {
    resizable: false,
    minWidth: 100,
    suppressNavigable: true,
    suppressMovable: true,
    getQuickFilterText: () => '',
  };
  overlayComponent = NoRowsOverlayComponent;
  overlayParams: NoRowsOverlayParams = {
    message: INITIAL_NO_ROWS_MESSAGE,
  };

  @ViewChild(SparklineFactoryComponent) sparklineFactory!: SparklineFactoryComponent;

  data: OperatorPerformance[] = [];
  sparklines: Record<string, SafeHtml> = {};
  loading = true;
  errored = false;
  paginationChanged$ = new Subject<PaginationChangedEvent>();
  loaded$ = new Subject();
  destroy$ = new Subject();
  gridReady$ = new Subject();

  _gridFilter = '';
  normalGridFilter = '';
  get gridFilter(): string {
    return this._gridFilter;
  }
  set gridFilter(value: string) {
    this._gridFilter = value;
    this.normalGridFilter = value.replace(/[^\w]/g, '');
  }

  constructor(
    private onTimeService: OnTimeService,
    private paramsService: ParamsService,
    private percent: PercentPipe
  ) {}

  ngOnInit() {
    this.paramsService.params$
      .pipe(
        map(({ fromTimestamp, toTimestamp, filters }) => ({ fromTimestamp, toTimestamp, filters })),
        distinctUntilChanged(),
        tap(() => {
          this.loading = true;
          this.errored = false;
        }),
        switchMap((params) =>
          this.onTimeService.fetchOperatorPerformanceList(params).pipe(
            catchError(() => {
              this.errored = true;
              return of([]);
            })
          )
        ),
        tap(() => {
          this.loading = false;
          this.loaded$.next();
        }),
        map((data) => data.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => (this.data = data));

    const chartInterval = ({ fromTimestamp, filters: { granularity }, toTimestamp }: PerformanceParams): Interval =>
      Interval.fromDateTimes(
        DateTime.fromJSDate(fromTimestamp),
        DateTime.fromJSDate(toTimestamp).minus({ [granularity ?? 'days']: 1 })
      );

    this.loaded$
      .pipe(
        switchMap(() => this.gridReady$),
        switchMap(() => this.paginationChanged$),
        withLatestFrom(this.paramsService.params$.pipe(map((params) => this.granularParams(params)))),
        switchMap(([event, params]) =>
          from(event.api.getRenderedNodes()).pipe(
            mergeMap((node) =>
              this.onTimeService
                .fetchOnTimeTimeSeriesData({
                  ...params,
                  filters: { ...params.filters, nocCodes: [node.data.nocCode] },
                })
                .pipe(map((data) => ({ node, data })))
            ),
            concatMap(({ node, data }) =>
              this.sparklineFactory.renderStatic(data, chartInterval(params)).pipe(map((svg) => ({ node, svg })))
            ),
            map((result) => ({ event, ...result }))
          )
        )
      )
      .subscribe(({ event, node, svg }) => {
        this.sparklines[node.data.nocCode] = svg;
        event.api.refreshCells({ rowNodes: [node] });
      });
  }

  granularParams(params: PerformanceParams): PerformanceParams {
    const fromDate = DateTime.fromJSDate(params.fromTimestamp);
    const toDate = DateTime.fromJSDate(params.toTimestamp);

    const granularity = Math.abs(toDate.diff(fromDate, 'days').days) <= 5 ? Granularity.Hour : Granularity.Day;

    return {
      ...params,
      filters: { ...params.filters, granularity },
    };
  }

  ngOnDestroy() {
    this.paginationChanged$.complete();
    this.loaded$.complete();
    this.gridReady$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterChanged({ api }: FilterChangedEvent) {
    const rowCount = api.paginationGetRowCount() ?? 0;
    if (this.data.length > 0 && rowCount === 0) {
      this.overlayParams.message = 'No operators matched the search query';
      api.showNoRowsOverlay();
    } else if (rowCount > 0) {
      api.hideOverlay();
      this.overlayParams.message = INITIAL_NO_ROWS_MESSAGE;
    }
  }
}
