import { injectService, sleep } from '@ngbase/adk/test';
import { Cache } from './cache';

describe('Cache', () => {
  let cache: Cache;
  beforeEach(() => {
    cache = injectService(Cache);
  });

  it('should create', () => {
    expect(cache).toBeTruthy();
  });

  it('should have default config and update it', () => {
    expect(cache['defaultConfig']).toEqual({ timeToLive: 0 });
    cache.setConfig({ timeToLive: 10000 });
    expect(cache['defaultConfig']).toEqual({ timeToLive: 10000 });
  });

  it('should add to cache', () => {
    cache.addToCache('url', 'response', { timeToLive: 10000 });
    expect(cache.isCached('url')).toBe(true);
  });

  it('should clear cache', () => {
    cache.addToCache('url', 'response', { timeToLive: 10000 });
    cache.addToCache('url2', 'response2', { timeToLive: 10000 });
    cache.clearCache('url');
    expect(cache.isCached('url')).toBe(false);
    expect(cache.isCached('url2')).toBe(true);

    cache.clearCache();
    expect(cache['cache'].size).toBe(0);
  });

  it('should return whether is cached', () => {
    cache.addToCache('url3', 'response3', { timeToLive: 10000 });
    expect(cache.isCached('url3')).toBe(true);
    expect(cache.isCached('url4')).toBe(false);
  });

  it('should get from cache', () => {
    cache.addToCache('url5', 'response5', { timeToLive: 10000 });
    expect(cache.get('url5')).toEqual('response5');
  });

  it('should not get from cache if expired', async () => {
    cache.addToCache('url6', 'response6', { timeToLive: 1 });
    await sleep(2);
    expect(cache.get('url6')).toBeNull();
  });
});
