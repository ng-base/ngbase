import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideTooltipOptions } from '@meeui/ui/tooltip';
import { provideTranslate } from '@meeui/ui/translate';
import { provideInternetAvailabilityInterceptor, provideJwt } from '@meeui/ui/adk';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideAnimations(),
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideTooltipOptions({ showDelay: 1000 }),
    provideInternetAvailabilityInterceptor(),
    provideJwt(() => ({ tokenGetter: () => localStorage.getItem('auth_token') })),
    provideTranslate({ defaultLang: 'en' }),
  ],
};
