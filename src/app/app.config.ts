import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

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
  ],
};
