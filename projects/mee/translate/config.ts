import { inject, InjectionToken, provideAppInitializer } from '@angular/core';
import { TranslateService } from './translate.service';
import { catchError, delay, Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface TranslateConfig {
  defaultLang: string;
  loader?: (lang: string, fallbackLang: string) => Observable<Record<string, any>>;
}

export const TRANSLATE_CONFIG = new InjectionToken<TranslateConfig>('TRANSLATE_CONFIG');

export function provideTranslate(config: TranslateConfig) {
  config.loader ??= defaultLoader;

  return [
    { provide: TRANSLATE_CONFIG, useValue: config },
    TranslateService,
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      return translate.init();
    }),
  ];
}

export function interpolate(translation: string, params: Record<string, any>) {
  return translation?.replace(/{{([^}]+)}}/g, (match, p1) => {
    return params[p1] || params[p1.trim()] || match;
  });
}

function defaultLoader(lang: string, fallbackLang: string) {
  const http = inject(HttpClient);
  return of([]).pipe(
    delay(1000),
    switchMap(() =>
      http
        .get<Record<string, any>>(`/i18n/${lang}.json`)
        .pipe(catchError(() => http.get<Record<string, any>>(`/i18n/${fallbackLang}.json`))),
    ),
  );
}
