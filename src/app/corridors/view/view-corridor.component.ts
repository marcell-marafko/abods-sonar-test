import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateTime, Duration } from 'luxon';
import { DateRangeService } from '../../shared/services/date-range.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CorridorGranularity } from '../../../generated/graphql';
import { FromTo } from '../../shared/components/date-range/date-range.types';
import { combineLatest, of, Subject } from 'rxjs';
import { Corridor, CorridorsService, CorridorStats, CorridorStatsViewParams, Stop } from '../corridors.service';
import { AgGridEvent, ColDef, GridOptions } from 'ag-grid-community';
import { BRITISH_ISLES_BBOX, position } from '../../shared/geo';
import { bbox, featureCollection, lineString, point } from '@turf/turf';
import { FeatureCollection, LineString, Point } from 'geojson';
import { BBox2d } from '@turf/helpers/dist/js/lib/geojson';
import { MapComponent } from 'ngx-mapbox-gl';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { pairwise } from '../segment-selector/segment-selector.component';
import { SelectableTextCellRendererComponent } from '../../shared/components/ag-grid/selectable-text-cell/selectable-text-cell.component';
import { AgGridDirective } from '../../shared/components/ag-grid/ag-grid.directive';
import { AgGridDomService } from '../../shared/components/ag-grid/ag-grid-dom.service';

@Component({
  templateUrl: 'view-corridor.component.html',
  styleUrls: ['./view-corridor.component.scss'],
})
export class ViewCorridorComponent implements OnInit, OnDestroy {
  dateRange = new FormControl(this.dateRangeService.calculatePresetPeriod('last28', DateTime.local()));
  loadingCorridor = false;
  errorMessage?: string;
  errorHeading?: string;
  corridor?: Corridor;
  stats?: CorridorStats;
  loadingStats?: boolean;
  params?: CorridorStatsViewParams;
  selectedStops$ = new Subject<Stop[]>();
  onDestroy$ = new Subject();

  bounds = BRITISH_ISLES_BBOX;
  corridorLine?: FeatureCollection<LineString, { segmentId: string }>;
  corridorStops?: FeatureCollection<Point, Stop>;
  popupStop?: Stop;
  selectAll = true;

  gridOptions: GridOptions = {
    rowSelection: 'single',
    suppressDragLeaveHidesColumns: true,
    suppressCellSelection: false,
    onFirstDataRendered: this.gridHeaderHeightSetter.bind(this),
  };

  columnDefs: ColDef[] = [
    {
      headerName: 'Service',
      valueGetter: ({ data }) => `${data.lineName}: ${data.servicePatternName}`,
      cellRendererFramework: SelectableTextCellRendererComponent,
      cellRendererParams: { noWrap: true, textOverflow: 'ellipsis' },
      comparator: (a, b) => a?.localeCompare(b, undefined, { numeric: true }),
      flex: 1,
      sort: 'asc',
    },
    {
      field: 'noc',
      headerName: 'NOC',
      cellRendererFramework: SelectableTextCellRendererComponent,
      cellRendererParams: { noWrap: true, textOverflow: 'visible' },
      maxWidth: 90,
    },
    {
      field: 'operatorName',
      headerName: 'Operator',
      cellRendererFramework: SelectableTextCellRendererComponent,
      cellRendererParams: { noWrap: true, textOverflow: 'visible' },
      minWidth: 170,
      maxWidth: 470,
      wrapText: false,
    },
    { field: 'scheduledTransits', headerName: 'Scheduled transits', type: 'numericColumn', maxWidth: 160 },
    { field: 'recordedTransits', headerName: 'Recorded transits', type: 'numericColumn', maxWidth: 160 },
    {
      headerName: 'Average journey time',
      type: 'numericColumn',
      valueGetter: ({ data }) => data.totalJourneyTime / data.recordedTransits,
      valueFormatter: ({ value }) => Duration.fromObject({ seconds: value }).toFormat('mm:ss'),
      maxWidth: 160,
    },
  ];

  defaultColumnDef: ColDef = {
    sortable: true,
    unSortIcon: true,
    sortingOrder: ['asc', 'desc'],
  };

  @ViewChild(MapComponent) map?: MapComponent;
  @ViewChild(AgGridDirective) agGrid?: AgGridDirective = undefined;

  constructor(
    private dateRangeService: DateRangeService,
    private corridorsService: CorridorsService,
    private route: ActivatedRoute,
    private agGridDomService: AgGridDomService
  ) {}

  get averageJourneyTime(): Duration {
    return Duration.fromObject({ seconds: this.stats?.summaryStats?.averageJourneyTime ?? undefined });
  }

  get missingTransits(): number | undefined {
    const summary = this.stats?.summaryStats;
    return summary?.scheduledTransits && summary?.totalTransits
      ? summary?.scheduledTransits - summary?.totalTransits
      : undefined;
  }

  ngOnDestroy(): void {
    this.selectedStops$.complete();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() {
    const corridorId$ = this.route.paramMap.pipe(
      takeUntil(this.onDestroy$),
      map((paramMap) => paramMap.get('corridorId') as string)
    );

    corridorId$
      .pipe(
        distinctUntilChanged(),
        tap(() => {
          this.loadingCorridor = true;
          this.errorMessage = undefined;
          this.errorHeading = undefined;
        }),
        switchMap((corridorId) =>
          this.corridorsService.fetchCorridorById(Number(corridorId)).pipe(
            catchError((err) => {
              const errorMessage = err as string;
              if (
                errorMessage === 'Corridor does not exist.' ||
                errorMessage.match(/Variable \S+ of non-null type \S+ must not be null/)
              ) {
                this.errorHeading = 'Not found';
                this.errorMessage = 'Corridor not found, or you do not have permission to view.';
              } else {
                this.errorMessage = errorMessage;
              }
              return of(undefined);
            })
          )
        )
      )
      .subscribe((corridor) => {
        this.corridor = corridor;
        this.loadingCorridor = false;

        if (corridor) {
          this.corridorLine = featureCollection(
            pairwise(corridor.stops).map((segment) =>
              lineString([position(segment[0]), position(segment[1])], {
                segmentId: segment[0].stopId + segment[1].stopId,
              })
            )
          );
          this.corridorStops = featureCollection(corridor.stops.map((stop) => point(position(stop), stop)));
          this.bounds = bbox(this.corridorLine) as BBox2d;
        }
      });

    combineLatest([
      this.dateRange.valueChanges.pipe(startWith(this.dateRange.value as FromTo)),
      corridorId$,
      this.selectedStops$.pipe(startWith([])),
    ])
      .pipe(
        map(([{ from, to }, corridorId, stops]) => this.granularParams(from, to, corridorId, stops)),
        tap(() => (this.loadingStats = true)),
        switchMap((params) =>
          this.corridorsService.fetchStats(params).pipe(
            finalize(() => (this.loadingStats = false)),
            map((stats) => ({ stats, params })),
            catchError(() => of({ stats: undefined, params: undefined }))
          )
        )
      )
      .subscribe(({ stats, params }) => {
        this.stats = stats;
        this.params = params;
      });
  }

  granularParams(from: DateTime, to: DateTime, corridorId: string, stops: Stop[]): CorridorStatsViewParams {
    const granularity = Math.abs(to.diff(from, 'days').days) < 5 ? CorridorGranularity.Hour : CorridorGranularity.Day;
    return {
      corridorId,
      from,
      to,
      granularity,
      stops,
    };
  }

  setMapSelectedState(segment: [Stop, Stop] | []) {
    if (!segment?.length) {
      this.selectAll = true;
      return;
    }
    this.map?.mapInstance.setFeatureState(
      { source: 'corridor-line', id: segment[0].stopId + segment[1].stopId },
      { selected: true }
    );
  }

  clearMapSelectedState(segment: [Stop, Stop] | []) {
    if (!segment?.length) {
      this.selectAll = false;
      return;
    }
    this.map?.mapInstance.removeFeatureState(
      { source: 'corridor-line', id: segment[0].stopId + segment[1].stopId },
      'selected'
    );
  }

  setMapHoverState(stop?: Stop) {
    if (!stop) {
      return;
    }
    this.map?.mapInstance.setFeatureState({ source: 'corridor-stops', id: stop.stopId }, { hover: true });
  }

  clearMapHoverState(stop?: Stop) {
    if (!stop) {
      return;
    }
    this.map?.mapInstance.removeFeatureState({ source: 'corridor-stops', id: stop.stopId }, 'hover');
  }

  mapEventStop({ features }: { features?: MapboxGeoJSONFeature[] }): Stop | undefined {
    return features?.[0].properties as Stop;
  }

  gridHeaderHeightSetter() {
    const padding = 20;
    this.agGrid?.gridApi?.setHeaderHeight(this.agGridDomService.headerHeight() + padding);
  }

  onGridReady(params: AgGridEvent) {
    params.api.sizeColumnsToFit();
    params.api.resetRowHeights();
    params.api.setDomLayout('autoHeight');
  }
}
