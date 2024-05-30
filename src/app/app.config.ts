import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideEcharts } from 'ngx-echarts';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_INITIALIZER, useFactory: () => [] },
    provideRouter(routes, withInMemoryScrolling()),
    provideAnimations(),
    provideExperimentalZonelessChangeDetection(),
    provideEcharts(),
    // provideClientHydration(),
  ],
};
