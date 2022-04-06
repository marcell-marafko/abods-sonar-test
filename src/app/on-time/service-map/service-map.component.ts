import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FeatureCollection, LineString, Point } from 'geojson';
import { bbox, featureCollection, lineString, point } from '@turf/turf';
import { BBox2d } from '@turf/helpers/dist/js/lib/geojson';
import { TransitModelService } from '../transit-model.service';
import { PerformanceInputType } from '../../../generated/graphql';
import { forkJoin, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EventData, LngLatLike, MapboxGeoJSONFeature, MapMouseEvent } from 'mapbox-gl';
import { isNotNullOrUndefined } from '../../shared/rxjs-operators';
import { OnTimeService, PerformanceParams } from '../on-time.service';
import { StopPerformanceService } from '../stop-performance.service';
import { BRITISH_ISLES_BBOX, position } from '../../shared/geo';

export type Stop = { naptan: string; stopName: string; stopLocality?: string };

export interface StopInfo {
  type: 'stop';
  position: LngLatLike;
  stop: Stop;
}

export interface ClusterInfo {
  type: 'cluster';
  position: LngLatLike;
  stops: Stop[];
}

export type PopupInfo = StopInfo | ClusterInfo;

const caseClustered = (ifCluster: unknown[], ifPoint: unknown[]) => [
  'case',
  ['has', 'point_count'],
  ifCluster,
  ifPoint,
];

@Component({
  selector: 'app-service-map',
  templateUrl: 'service-map.component.html',
  styleUrls: ['./service-map.component.scss'],
})
export class ServiceMapComponent implements OnInit, OnDestroy {
  @Input()
  set params(value: PerformanceParams | null) {
    if (value?.filters?.lineIds) {
      this.params$.next(value as PerformanceInputType);
    }
  }
  private params$ = new ReplaySubject<PerformanceInputType>(1);

  getEarlyNorm = caseClustered(['/', ['get', 'earlyNormSum'], ['get', 'totalSum']], ['get', 'earlyNorm']);
  getLateNorm = caseClustered(['/', ['get', 'lateNormSum'], ['get', 'totalSum']], ['get', 'lateNorm']);
  getDelayNorm = caseClustered(['/', ['get', 'delayNormSum'], ['get', 'totalSum']], ['get', 'delayNorm']);
  getEarlyRatio = caseClustered(['/', ['get', 'earlySum'], ['get', 'totalSum']], ['get', 'earlyRatio']);
  getLateRatio = caseClustered(['/', ['get', 'lateSum'], ['get', 'totalSum']], ['get', 'lateRatio']);
  getDelay = caseClustered(['/', ['get', 'averageDelaySum'], ['get', 'totalSum']], ['get', 'averageDelay']);

  isNoData = ['get', 'noData'];
  isOnTime = ['all', ['<=', this.getEarlyNorm, 0], ['<=', this.getLateNorm, 0]];
  isLate = ['>', this.getLateNorm, this.getEarlyNorm];
  isBothLateAndEarly = ['all', ['>', this.getEarlyNorm, 0], ['>', this.getLateNorm, 0]];
  greatestEarlyOrLate = ['max', this.getEarlyNorm, this.getLateNorm];
  smallestEarlyOrLate = ['min', this.getEarlyNorm, this.getLateNorm];
  delayMinutes = ['floor', ['/', ['abs', this.getDelay], 60]];
  delaySeconds = ['-', ['floor', ['abs', this.getDelay]], ['*', this.delayMinutes, 60]];

  servicePatterns?: FeatureCollection<LineString>;
  stops?: FeatureCollection<Point>;
  bounds: BBox2d = BRITISH_ISLES_BBOX;
  popupInfo?: PopupInfo;
  view: 'route' | 'performance' | 'delay' | 'delay-nocluster' = 'performance';

  // Angular doesn't recognise discriminated unions with fullTemplateTypeCheck on :sadface:
  get stopInfo(): StopInfo | undefined {
    return this.popupInfo?.type === 'stop' ? this.popupInfo : undefined;
  }
  get clusterInfo(): ClusterInfo | undefined {
    return this.popupInfo?.type === 'cluster' ? this.popupInfo : undefined;
  }

  constructor(
    private transitModelService: TransitModelService,
    private onTimeService: OnTimeService,
    private stopPerformanceService: StopPerformanceService
  ) {}

  ngOnInit() {
    this.params$
      .pipe(
        switchMap((params) =>
          forkJoin([
            this.onTimeService.fetchStopPerformanceList(params),
            this.transitModelService.fetchServicePatternStops(
              params.filters?.nocCodes ? params.filters.nocCodes[0] : null,
              params.filters?.lineIds ? params.filters.lineIds[0] : null
            ),
          ])
        )
      )
      .subscribe(([stopPerformance, servicePatterns]) => {
        this.servicePatterns = featureCollection(
          servicePatterns.map(({ servicePatternId, stops }) => lineString(stops.map(position), { servicePatternId }))
        );
        this.bounds = bbox(this.servicePatterns) as BBox2d;

        const stopData = this.stopPerformanceService.mergeStops(stopPerformance, servicePatterns);

        this.stops = featureCollection(stopData.map((stop) => point(position(stop), stop)));
      });
  }

  ngOnDestroy() {
    this.params$.complete();
  }

  setHoveredStop(event: MapMouseEvent & { features?: MapboxGeoJSONFeature[] } & EventData) {
    const pos = (event.features?.[0].geometry as Point).coordinates as [number, number];
    const props = event.features?.[0].properties;
    if (props?.stopData && typeof props?.stopData === 'string') {
      const stops: Stop[] = props?.stopData
        .split('|')
        .filter(isNotNullOrUndefined)
        .map((tokens) => tokens.split(','))
        .filter(isNotNullOrUndefined)
        .map(([naptan, stopName]) => ({ naptan, stopName }));

      this.popupInfo = { type: 'cluster', position: pos, stops };
    } else if (props?.stopName && props?.stopId) {
      this.popupInfo = {
        type: 'stop',
        position: pos,
        stop: { naptan: props.naptan, stopName: props.stopName, stopLocality: props.stopLocality },
      };
    }
  }

  clearHoveredStop() {
    this.popupInfo = undefined;
  }
}
