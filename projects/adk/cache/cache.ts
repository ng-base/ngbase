import { inject, Injectable } from '@angular/core';

export interface CacheConfig {
  timeToLive: number;
}

interface CacheEntry<T = unknown> {
  url: string;
  response: T;
  lastUpdated: number;
  config: CacheConfig;
}

@Injectable({ providedIn: 'root' })
export class Cache {
  private cache = new Map<string, CacheEntry>();
  private defaultConfig: CacheConfig = {
    timeToLive: 0, // 0 means no expiration
  };

  setConfig(config: Partial<CacheConfig>) {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  get<T>(url: string): T {
    const cachedResponse = this.getFromCache(url);
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

  private getFromCache<T>(url: string): T | null {
    const cached = this.cache.get(url) as CacheEntry<T> | undefined;
    if (!cached) return null;

    const isExpired =
      cached.config.timeToLive > 0 && Date.now() - cached.lastUpdated > cached.config.timeToLive;
    if (isExpired) {
      this.cache.delete(url);
      return null;
    }

    return cached.response;
  }

  addToCache(url: string, response: any, config: CacheConfig) {
    this.cache.set(url, {
      url,
      response,
      lastUpdated: Date.now(),
      config,
    });
  }
}

export const injectCache = () => inject(Cache);
