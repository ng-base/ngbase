import { InjectionToken } from '@angular/core';
import { Cache } from './cache';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { cacheInterceptor } from './cache.interecptor';

export type CacheInterceptorConfig = Partial<InternalCacheInterceptorConfig>;

export interface InternalCacheInterceptorConfig {
  enabled: boolean;
  cacheable: {
    methods: string[];
    urls: string[];
  };
  excludeUrls: string[];
  defaultTimeToLive: number;
}

export const CACHE_CONFIG = new InjectionToken<CacheInterceptorConfig>('CACHE_CONFIG', {
  factory: () => ({
    enabled: true,
    cacheable: {
      methods: ['GET'],
      urls: [],
    },
    excludeUrls: [],
    defaultTimeToLive: 300000,
  }),
});

export function provideCache(fn: () => CacheInterceptorConfig) {
  return [
    Cache,
    { provide: CACHE_CONFIG, useFactory: fn },
    { provide: HTTP_INTERCEPTORS, useFactory: cacheInterceptor, multi: true },
  ];
}
