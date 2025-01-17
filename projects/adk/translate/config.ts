import { HttpClient } from '@angular/common/http';
import { inject, InjectionToken, provideAppInitializer } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { TranslateService } from './translate.service';

export type Translation<T = any> = Record<string, T>;

export interface TranslateConfig {
  defaultLang: string;
  preloadedLanguages?: Record<string, Translation>;
  path?: string;
  loader?: (lang: string, fallbackLang: string, config: TranslateConfig) => Observable<Translation>;
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

function defaultLoader(lang: string, fallbackLang: string, config: TranslateConfig) {
  const http = inject(HttpClient);
  const path = config.path ?? '/i18n/';
  return http
    .get<Record<string, any>>(`${path}${lang}.json`)
    .pipe(catchError(() => http.get<Record<string, any>>(`${path}${fallbackLang}.json`)));
  // return of([]).pipe(
  //   delay(1),
  //   switchMap(() =>
  //     http
  //       .get<Record<string, any>>(`/i18n/${lang}.json`)
  //       .pipe(catchError(() => http.get<Record<string, any>>(`/i18n/${fallbackLang}.json`))),
  //   ),
  // );
}
