import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { UserFragment } from 'src/generated/graphql';
import { ConfigService } from './config/config.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private gtag: Gtag.Gtag;

  tagAdded = false;

  constructor(@Inject(DOCUMENT) private document: Document, private config: ConfigService) {
    if (document.defaultView) {
      this.gtag = document.defaultView.gtag;
    } else {
      throw 'Could not fetch gtag';
    }
  }

  get pushTag(): Gtag.Gtag {
    if (!this.tagAdded) {
      this.addGtmScriptTagToDom();
    }
    return this.gtag;
  }

  pushPageView(page_path: string) {
    try {
      this.pushTag('config', this.config.analyticsId, { page_path });
    } catch {
      // Everything is fine
    }
  }

  customDimensionsConfigured = false;

  configureCustomDimensions() {
    this.pushTag('config', this.config.analyticsId, {
      custom_map: {
        dimension1: 'user_id',
        dimension2: 'organisation_id',
        dimension3: 'organisation_name',
      },
    });
    this.customDimensionsConfigured = true;
  }

  pushUserInfo(user: UserFragment | null) {
    const gtag = this.pushTag;
    if (!this.customDimensionsConfigured) {
      this.configureCustomDimensions();
    }
    gtag('event', 'user_changed', {
      user_id: user?.id,
      organisation_id: user?.organisation?.id,
      organisation_name: user?.organisation?.name,
    });
  }

  addGtmScriptTagToDom() {
    try {
      const gtmScriptTag = this.document.createElement('script');
      gtmScriptTag.async = true;
      gtmScriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.analyticsId}`;
      this.document.head.appendChild(gtmScriptTag);
      this.tagAdded = true;
    } catch (ex) {
      console.warn(ex);
    }
  }
}
