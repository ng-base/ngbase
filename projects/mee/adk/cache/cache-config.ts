import { InjectionToken } from '@angular/core';

export interface CacheInterceptorConfig {
  enabled: boolean;
  cacheable: {
    methods: string[];
    urls: string[];
  };
  excludeUrls: string[];
  defaultTimeToLive?: number;
}

export const CACHE_CONFIG = new InjectionToken<CacheInterceptorConfig>('CACHE_CONFIG', {
  factory: () => ({
    enabled: false,
    cacheable: {
      methods: ['GET'],
      urls: [],
    },
    excludeUrls: [],
    defaultTimeToLive: 300000,
  }),
});
