import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideTooltipDefaultOptions } from '@meeui/tooltip';
import { provideInternetAvailabilityInterceptor, provideJwt } from '@meeui/utils';

export const appConfig: ApplicationConfig = {
  providers: [
    // { provide: APP_INITIALIZER, useFactory: () => [] },
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideAnimations(),
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(),
    provideClientHydration(),
    provideTooltipDefaultOptions({ showDelay: 1000 }),
    provideInternetAvailabilityInterceptor(),
    provideJwt(() => ({ tokenGetter: () => localStorage.getItem('auth_token') })),
  ],
};
