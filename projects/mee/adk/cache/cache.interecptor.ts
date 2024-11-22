import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';
import { injectCache } from './cache';
import { CACHE_CONFIG, InternalCacheInterceptorConfig } from './cache-config';

export const cacheInterceptor: HttpInterceptorFn = (request, next) => {
  const cache = injectCache();
  const config = inject(CACHE_CONFIG) as InternalCacheInterceptorConfig;

  // If not cacheable,  return the response
  if (!shouldCache(request, config)) {
    return next(request);
  }

  // Check for cache control headers
  const noCache = request.headers.get('Cache-Control') === 'no-cache';
  if (noCache) {
    cache.clearCache(request.url);
    return next(request);
  }

  // Get cache config for this request
  const timeToLive = config.defaultTimeToLive;

  // Try to get from cache
  const cachedResponse = cache.get(request.url);
  if (cachedResponse) {
    return of(new HttpResponse({ body: cachedResponse }));
  }

  // If not in cache, make the request and cache the response
  return next(request).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.addToCache(request.url, event.body, { timeToLive: config.defaultTimeToLive! });
      }
    }),
  );
};

function shouldCache(
  request: HttpRequest<unknown>,
  config: InternalCacheInterceptorConfig,
): boolean {
  // Fall back to global config
  if (!config.enabled) {
    return false;
  }

  if (!config.cacheable.methods.includes(request.method)) {
    return false;
  }

  if (config.excludeUrls.some(url => request.url.includes(url))) {
    return false;
  }

  if (config.cacheable.urls.length > 0) {
    return config.cacheable.urls.some(url => request.url.includes(url));
  }

  return false;
}
