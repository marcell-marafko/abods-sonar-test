import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { PerformanceParams } from './on-time.service';

@Injectable({
  providedIn: 'root',
})
export class ParamsService {
  params = new ReplaySubject<PerformanceParams>(1);
  get params$() {
    return this.params.asObservable();
  }
}
