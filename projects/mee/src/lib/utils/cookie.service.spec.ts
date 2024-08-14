import { TestBed } from '@angular/core/testing';
import { CookieService } from './cookie.service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService],
    });
    service = TestBed.inject(CookieService);
    document.cookie = ''; // Clear cookies before each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setCookie', () => {
    it('should set a cookie with default options', () => {
      service.setCookie('test', 'value');
      expect(document.cookie).toContain('test=value');
    });

    it('should set a cookie with expiration date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      service.setCookie('test', 'value', { expires: futureDate });
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
      expect(service.getCookie('test')).toBe('value');
    });

    it('should return null for non-existent cookie', () => {
      expect(service.getCookie('nonexistent')).toBeNull();
    });

    it('should handle URL encoded characters', () => {
      document.cookie = 'test=%3Dvalue%26';
      expect(service.getCookie('test')).toBe('=value&');
    });
  });

  describe('deleteCookie', () => {
    it('should delete a cookie', () => {
      document.cookie = 'test=value';
      service.deleteCookie('test');
      expect(service.getCookie('test')).toBeNull();
    });
  });

  describe('getAllCookies', () => {
    it('should get all cookies', () => {
      document.cookie = 'test1=value1';
      document.cookie = 'test2=value2';
      const cookies = service.getAllCookies();
      expect(cookies).toEqual({ test1: 'value1', test2: 'value2' });
    });
  });

  describe('clearAllCookies', () => {
    it('should clear all cookies', () => {
      document.cookie = 'test1=value1';
      document.cookie = 'test2=value2';
      service.clearAllCookies();
      expect(document.cookie).toBe('');
    });
  });

  describe('hasCookie', () => {
    it('should return true for existing cookie', () => {
      document.cookie = 'test=value';
      expect(service.hasCookie('test')).toBe(true);
    });

    it('should return false for non-existent cookie', () => {
      expect(service.hasCookie('nonexistent')).toBe(false);
    });
  });

  describe('updateCookie', () => {
    it('should update an existing cookie', () => {
      service.setCookie('test', 'oldValue');
      const updated = service.updateCookie('test', 'newValue');
      expect(updated).toBe(true);
      expect(service.getCookie('test')).toBe('newValue');
    });

    it('should not update a non-existent cookie', () => {
      const updated = service.updateCookie('nonexistent', 'newValue');
      expect(updated).toBe(false);
      expect(service.getCookie('nonexistent')).toBeNull();
    });
  });
});
