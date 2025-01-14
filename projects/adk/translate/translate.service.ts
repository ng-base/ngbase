import {
  computed,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { of, tap } from 'rxjs';
import { interpolate, TRANSLATE_CONFIG, TranslateConfig, Translation } from './config';

@Injectable()
export class TranslateService {
  private config = inject<TranslateConfig>(TRANSLATE_CONFIG);
  private readonly _defaultLang = signal(this.config.defaultLang);
  private readonly _currentLang = signal<string>(this._defaultLang());
  readonly defaultLang = this._defaultLang.asReadonly();
  readonly currentLang = this._currentLang.asReadonly();
  private lastLang = this.currentLang();
  private readonly cachedTranslations = signal<
    Record<string, { data: Translation; cache: Map<string, string> }>
  >({});
  private readonly _translationData = computed(
    () =>
      this.cachedTranslations()[this.currentLang()] ||
      this.cachedTranslations()[this.lastLang] ||
      this.cachedTranslations()[this.defaultLang()] ||
      {},
  );
  readonly translations = computed(() => this._translationData().data || {});
  readonly envInjector = inject(EnvironmentInjector);
  readonly status = signal<'loading' | 'done' | 'error'>('loading');

  init() {
    return this.loadTranslations(this.currentLang(), this.defaultLang());
  }

  setDefaultLang(lang: string) {
    this._defaultLang.set(lang);
  }

  use(lang: string) {
    this.lastLang = this.currentLang();
    this._currentLang.set(lang);
    if (this.cachedTranslations()[lang]) return;
    runInInjectionContext(this.envInjector, () => {
      this.loadTranslations(lang, this.defaultLang()).subscribe();
    });
  }

  private loadTranslations(lang: string, fallbackLang: string) {
    this.status.set('loading');
    const data = this.config.preloadedLanguages?.[lang];
    const api = data ? of(data) : this.config.loader!(lang, fallbackLang);
    return api.pipe(
      tap(res => {
        this.cachedTranslations.update(cache => ({
          ...cache,
          [lang]: { data: res, cache: new Map() },
        }));
        this.status.set('done');
      }),
    );
  }

  /**
   * @key - The key to translate.
   * @data - The data to pass to the translation.
   * @returns The translated value.
   * The key can be a string or a nested key.
   * The data is used to interpolate the translation.
   */
  translate = (
    key: string,
    params: Record<string, any> = {},
    translationData: Translation = this.translations(),
  ) => {
    // we need to split the key by '.' and then interpolate the data
    const keys = key.split('.');
    let translation = keys.reduce((acc, k) => {
      return acc[k];
    }, translationData) as unknown as string;

    // translate the key with the params
    translation = interpolate(translation, params);

    return translation;
  };
}

// function memoize(fn: (...args: any[]) => any) {
//   const cache = new Map();
//   return (...args: any[]) => {
//     const key = JSON.stringify(args);
//     if (cache.has(key)) {
//       console.log('CACHE HIT', key);
//       return cache.get(key);
//     }
//     console.log('CACHE MISS', key);
//     const result = fn(...args);
//     cache.set(key, result);
//     return result;
//   };
// }

export const injectTranslate = () => inject(TranslateService);
