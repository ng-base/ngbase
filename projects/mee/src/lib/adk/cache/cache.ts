// http-cache.service.ts
import { Injectable } from '@angular/core';

export interface CacheConfig {
  timeToLive: number;
  //   maxSize: number;
}

interface CacheEntry<T = unknown> {
  url: string;
  response: T;
  lastUpdated: number;
}

@Injectable({ providedIn: 'root' })
export class Cache {
  private cache = new Map<string, CacheEntry>();
  private defaultConfig: CacheConfig = {
    timeToLive: 300000,
    // maxSize: 100,
  };

  //   private http = inject(HttpClient);

  setConfig(config: Partial<CacheConfig>) {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  get<T>(url: string, config?: Partial<CacheConfig>): T {
    const cacheConfig = { ...this.defaultConfig, ...config };
    const cachedResponse = this.getFromCache(url, cacheConfig.timeToLive);
    return cachedResponse as T;
  }

  clearCache(url?: string) {
    if (url) {
      this.cache.delete(url);
    } else {
      this.cache.clear();
    }
  }

  isCached(url: string): boolean {
    return this.cache.has(url);
  }

  private getFromCache<T>(url: string, timeToLive: number): T | null {
    const cached = this.cache.get(url) as CacheEntry<T> | undefined;
    if (!cached) return null;

    const isExpired = Date.now() - cached.lastUpdated > timeToLive;
    if (isExpired) {
      this.cache.delete(url);
      return null;
    }

    return cached.response;
  }

  addToCache(url: string, response: any) {
    // if (this.cache.size >= config.maxSize) {
    //   const oldestUrl = this.cache.keys().next().value;
    //   this.cache.delete(oldestUrl);
    // }

    this.cache.set(url, {
      url,
      response,
      lastUpdated: Date.now(),
    });
  }
}
