import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCache } from '@ngbase/adk/cache';
import { provideJwt } from '@ngbase/adk/jwt';
import { provideNetworkInterceptor } from '@ngbase/adk/network';
import { provideTranslate } from '@ngbase/adk/translate';
import { registerPopover } from '@meeui/ui/popover';
import { provideTooltipOptions } from '@meeui/ui/tooltip';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideAnimations(),
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideClientHydration(withIncrementalHydration()),
    provideTooltipOptions({ showDelay: 1000 }),
    provideNetworkInterceptor(),
    provideJwt(() => ({ tokenGetter: () => localStorage.getItem('auth_token') })),
    provideTranslate({ defaultLang: 'en' }),
    registerPopover(),
    provideCache(() => ({
      enabled: true,
      defaultTimeToLive: 0,
      cacheable: {
        methods: ['GET'],
        urls: [],
      },
      excludeUrls: [],
    })),
  ],
};
