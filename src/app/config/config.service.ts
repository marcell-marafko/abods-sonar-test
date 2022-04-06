import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

export interface ConfigObject {
  apiUrl: string;
  analyticsId: string;
  mapboxToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config?: ConfigObject;

  constructor(private http: HttpClient) {}

  fetchValue(k: keyof ConfigObject): string {
    if (!this.config) {
      throw new Error('Config not loaded');
    }
    if (!this.config[k]) {
      throw new Error(`${k} not defined in config.json`);
    }
    return this.config[k];
  }

  get apiUrl(): string {
    return this.fetchValue('apiUrl');
  }

  get analyticsId(): string {
    return this.fetchValue('analyticsId');
  }

  get mapboxToken(): string {
    return this.fetchValue('mapboxToken');
  }

  loadConfig() {
    return this.http.get('./config.json').pipe(map((config: unknown) => (this.config = config as ConfigObject)));
  }
}
