import { injectService } from '@meeui/adk/test';
import { CookieService } from './cookie.service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(async () => {
    service = injectService(CookieService, [CookieService]);
    document.cookie = ''; // Clear cookies before each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setCookie', () => {
    it('should set a cookie with default options', () => {
      service.set('test', 'value');
      expect(document.cookie).toContain('test=value');
    });

    it('should set a cookie with expiration date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      service.set('test', 'value', { expires: futureDate });
      expect(document.cookie).toContain('test=value');
    });

    // it('should set a cookie with path', () => {
    //   service.setCookie('test', 'value', { path: '/test' });
    //   expect(document.cookie).toContain('path=/test');
    // });

    // it('should set a secure cookie', () => {
    //   service.setCookie('test', 'value', { secure: true });
    //   expect(document.cookie).toContain('test=value');
    //   // Note: 'secure' flag might not be visible in document.cookie for security reasons
    // });

    // it('should set a cookie with SameSite option', () => {
    //   service.setCookie('test', 'value', { sameSite: 'Strict' });
    //   expect(document.cookie).toContain('samesite=Strict');
    // });
  });

  describe('getCookie', () => {
    it('should get a cookie value', () => {
      document.cookie = 'test=value';
      expect(service.get('test')).toBe('value');
    });

    it('should return null for non-existent cookie', () => {
      expect(service.get('nonexistent')).toBeNull();
    });

    it('should handle URL encoded characters', () => {
      document.cookie = 'test=%3Dvalue%26';
      expect(service.get('test')).toBe('=value&');
    });
  });

  describe('deleteCookie', () => {
    it('should delete a cookie', () => {
      document.cookie = 'test=value';
      service.delete('test');
      expect(service.get('test')).toBeNull();
    });
  });

  describe('getAllCookies', () => {
    it('should get all cookies', () => {
      document.cookie = 'test1=value1';
      document.cookie = 'test2=value2';
      const cookies = service.getAll();
      expect(cookies).toEqual({ test1: 'value1', test2: 'value2' });
    });
  });

  describe('clearAllCookies', () => {
    it('should clear all cookies', () => {
      document.cookie = 'test1=value1';
      document.cookie = 'test2=value2';
      service.clearAll();
      expect(document.cookie).toBe('');
    });
  });

  describe('hasCookie', () => {
    it('should return true for existing cookie', () => {
      document.cookie = 'test=value';
      expect(service.has('test')).toBe(true);
    });

    it('should return false for non-existent cookie', () => {
      expect(service.has('nonexistent')).toBe(false);
    });
  });

  describe('updateCookie', () => {
    it('should update an existing cookie', () => {
      service.set('test', 'oldValue');
      const updated = service.update('test', 'newValue');
      expect(updated).toBe(true);
      expect(service.get('test')).toBe('newValue');
    });

    it('should not update a non-existent cookie', () => {
      const updated = service.update('nonexistent', 'newValue');
      expect(updated).toBe(false);
      expect(service.get('nonexistent')).toBeNull();
    });
  });
});
