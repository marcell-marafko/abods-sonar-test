import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, share } from 'rxjs/operators';
import { OperatorDashboardFragment, OperatorDashboardVehicleCountsFragment } from 'src/generated/graphql';
import { DashboardService } from './dashboard.service';
import orderBy from 'lodash-es/orderBy';
import take from 'lodash-es/take';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];

  allOperatorsSubject = new Subject<OperatorDashboardFragment[]>();

  nocCodeSubject = new Subject<string | null>();
  nocCode: string | null = null;

  operatorSubject = new BehaviorSubject<OperatorDashboardFragment | { nocCode: 'all' }>({ nocCode: 'all' });

  selectedOperatorsSubject = new Subject<OperatorDashboardFragment[]>();
  selectedOperatorsVehicleCountsSubject = new Subject<OperatorDashboardVehicleCountsFragment[]>();

  private currentVehicles$: Observable<number> = this.selectedOperatorsVehicleCountsSubject.pipe(
    map((allOperators) => allOperators.reduce((v, op) => v + (op?.feedMonitoring.liveStats?.currentVehicles ?? 0), 0))
  );
  currentVehicles = 0;

  private expectedVehicles$: Observable<number> = this.selectedOperatorsVehicleCountsSubject.pipe(
    map((allOperators) => allOperators.reduce((v, op) => v + (op?.feedMonitoring.liveStats?.expectedVehicles ?? 0), 0))
  );
  expectedVehicles = 0;

  private feedStatusOperators$: Observable<OperatorDashboardFragment[]> = this.selectedOperatorsSubject.pipe(
    map((selectedOperators) =>
      take(
        orderBy(
          selectedOperators,
          [
            (op) => op?.feedMonitoring?.feedStatus,
            (op) => op?.feedMonitoring?.liveStats?.feedErrors,
            (op) => op?.feedMonitoring?.liveStats?.feedAlerts,
          ],
          ['asc', 'desc', 'desc']
        ),
        5
      )
    )
  );
  feedStatusOperators: OperatorDashboardFragment[] = [];

  constructor(private service: DashboardService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.subs.push(
      this.currentVehicles$.subscribe((cv) => (this.currentVehicles = cv)),
      this.expectedVehicles$.subscribe((ev) => (this.expectedVehicles = ev)),
      this.feedStatusOperators$.subscribe((fsos) => (this.feedStatusOperators = fsos)),
      this.nocCodeSubject.subscribe((nocCode) => (this.nocCode = nocCode)),
      combineLatest([this.nocCodeSubject, this.allOperatorsSubject])
        .pipe(filter(([_, ops]) => ops && ops.length > 0))
        .subscribe(([latestNocCode, ops]) => {
          if (latestNocCode) {
            const operator = ops.find(({ nocCode }) => nocCode === latestNocCode);
            if (operator) {
              this.operatorSubject.next(operator);
              this.selectedOperatorsSubject.next([operator]);
            } else {
              this.router.navigate(['.'], {
                queryParams: { nocCode: null },
                queryParamsHandling: 'merge',
              });
            }
          } else {
            this.operatorSubject.next({ nocCode: 'all' });
            this.selectedOperatorsSubject.next(ops);
          }
        }),
      this.service.listOperators.subscribe((ops) => {
        this.allOperatorsSubject.next(ops);
        if (ops.length === 1) {
          this.nocCodeSubject.next(ops[0].nocCode);
        }
      }),
      combineLatest([this.nocCodeSubject, this.service.listOperatorVehicleCounts.pipe(share())])
        .pipe(
          map(([latestNocCode, ops]) => {
            if (latestNocCode) {
              const operator = ops.find(({ nocCode }) => nocCode === latestNocCode);
              if (operator) {
                return [operator];
              } else return [];
            }
            return ops;
          })
        )
        .subscribe(this.selectedOperatorsVehicleCountsSubject),
      this.route.queryParamMap
        .pipe(
          map((pm) => pm.get('nocCode') as string),
          distinctUntilChanged()
        )
        .subscribe((nocCode) => this.nocCodeSubject.next(nocCode))
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub?.unsubscribe());
  }

  changeOperator({ nocCode }: { nocCode: string; name?: string }) {
    this.router.navigate(['.'], {
      queryParams: { nocCode: nocCode === 'all' ? null : nocCode },
      queryParamsHandling: 'merge',
    });
  }
}
