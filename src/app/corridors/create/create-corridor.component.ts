import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { catchError, debounceTime, finalize, skipWhile, switchMap, takeUntil, tap } from 'rxjs/operators';
import { asGeoJsonPoints, CorridorsService, Stop } from '../corridors.service';
import { bbox, featureCollection, lineString } from '@turf/turf';
import { Feature, FeatureCollection, LineString, Point } from 'geojson';
import { BBox2d } from '@turf/helpers/dist/js/lib/geojson';
import { MapComponent } from 'ngx-mapbox-gl';
import { BRITISH_ISLES_BBOX, position } from '../../shared/geo';
import { Subject } from 'rxjs';
import { EventData, MapboxGeoJSONFeature, MapMouseEvent } from 'mapbox-gl';
import { Router } from '@angular/router';
import { asFormErrors, FormErrors } from '../../shared/gds/error-summary/error-summary.component';

// TODO extern this
const MAX_STOPS = 10;

@Component({
  templateUrl: 'create-corridor.component.html',
  styleUrls: ['./create-corridor.component.scss'],
})
export class CreateCorridorComponent implements OnInit, OnDestroy {
  corridorForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(256)]],
    stopQuery: '',
  });

  updated$ = new Subject<Stop[]>();
  matchingStops?: FeatureCollection<Point, Stop>;
  matchingStopLines?: FeatureCollection<LineString>;
  corridorStops?: FeatureCollection<Point, Stop>;
  corridorLine?: Feature<LineString>;
  stopList: Stop[] = [];
  bounds: BBox2d = BRITISH_ISLES_BBOX;
  loading = false;
  noData = false;
  submitted = false;
  saving = false;
  popupStop?: Stop;
  createError: FormErrors[] = [];
  destroy$ = new Subject();

  @ViewChild(MapComponent) map!: MapComponent;

  constructor(private formBuilder: FormBuilder, private corridorsService: CorridorsService, private router: Router) {}

  get name(): FormControl {
    return this.corridorForm.get('name') as FormControl;
  }

  get stopQuery(): FormControl {
    return this.corridorForm.get('stopQuery') as FormControl;
  }

  ngOnInit() {
    this.stopQuery.valueChanges
      .pipe(
        debounceTime(400),
        tap(() => {
          this.loading = true;
          this.noData = false;
          this.matchingStops = undefined;
        }),
        switchMap((query) =>
          this.corridorsService.queryStops(query).pipe(
            catchError(() => {
              this.loading = false;
              this.noData = true;
              return [];
            })
          )
        ),
        skipWhile(() => this.stopList.length > 0),
        takeUntil(this.destroy$)
      )
      .subscribe((stops) => {
        this.loading = false;
        this.noData = stops.length === 0;
        this.matchingStops = asGeoJsonPoints(stops);
        this.bounds = bbox(this.matchingStops) as BBox2d;
      });

    this.updated$
      .pipe(
        tap(() => {
          this.loading = true;
        }),
        switchMap((stopList) =>
          this.corridorsService
            .fetchSubsequentStops(stopList.map((stop) => stop.stopId))
            .pipe(finalize(() => (this.loading = false)))
        )
      )
      .subscribe((stops) => {
        this.noData = stops.length === 0;

        const [lastStop] = this.stopList.slice(-1);

        this.matchingStops = asGeoJsonPoints(stops);
        this.matchingStopLines = featureCollection(
          stops.map((stop) => lineString([position(lastStop), position(stop)], stop, { id: stop.intId }))
        );

        this.bounds = bbox(
          featureCollection([...(this.corridorStops?.features ?? []), ...this.matchingStops.features])
        ) as BBox2d;
      });
  }

  setHoverState(stop: Feature) {
    this.map.mapInstance.setFeatureState({ source: 'matching-stops', id: stop.id }, { hover: true });
    if (this.matchingStopLines) {
      this.map.mapInstance.setFeatureState({ source: 'matching-stop-lines', id: stop.id }, { hover: true });
    }
  }

  clearHoverState(stop: Feature) {
    this.map.mapInstance.removeFeatureState({ source: 'matching-stops', id: stop.id }, 'hover');
    if (this.matchingStopLines) {
      this.map.mapInstance.removeFeatureState({ source: 'matching-stop-lines', id: stop.id }, 'hover');
    }
  }

  setPopup(event: MapMouseEvent & { features?: MapboxGeoJSONFeature[] } & EventData) {
    if (event.features?.[0].properties) {
      this.popupStop = event.features[0].properties as Stop;
    }
  }

  clearPopup() {
    this.popupStop = undefined;
  }

  setStopList(stops: Stop[]) {
    this.stopList = stops;
    this.corridorStops = stops.length ? asGeoJsonPoints(stops) : undefined;
    this.corridorLine = stops.length > 1 ? lineString(stops.map(position)) : undefined;

    this.matchingStops = undefined;
    this.matchingStopLines = undefined;

    if (stops.length > 0 && stops.length < MAX_STOPS) {
      this.updated$.next(stops);
    } else if (stops.length === 0) {
      this.stopQuery.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    }
  }

  addStop(nextStop: Stop) {
    this.setStopList([...this.stopList, nextStop]);
  }

  removeLastStop() {
    this.setStopList(this.stopList.slice(0, -1));
  }

  submit() {
    this.submitted = true;
    if (this.name.invalid || this.saving) {
      return;
    }

    this.saving = true;
    this.corridorsService
      .createCorridor(
        this.name.value,
        this.stopList.map((stop) => stop.stopId)
      )
      .subscribe(
        // TODO consider forwarding directly to view page, if the created id can be made available
        () => this.router.navigate(['/corridors']),
        (err) => {
          this.saving = false;
          this.createError = asFormErrors(err);
        }
      );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.updated$.complete();
  }
}
