import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';

const DEFAULT_PATH = '/i18n/';

export function loadTranslations(lang: string, fallbackLang: string) {
  const http = inject(HttpClient);
  const path = `${DEFAULT_PATH}${lang}.json`;
  return http.get(path).pipe(catchError(() => http.get(`${DEFAULT_PATH}${fallbackLang}.json`)));
}
