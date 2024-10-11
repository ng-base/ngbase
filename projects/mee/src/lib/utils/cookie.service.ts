import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CookieService {
  private readonly sameSite: 'Lax' | 'Strict' | 'None' = 'Lax';

  constructor() {}

  set(
    name: string,
    value: string,
    options: {
      expires?: number | Date;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'Lax' | 'Strict' | 'None';
    } = {},
  ): void {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      if (typeof options.expires === 'number') {
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        options.expires = date;
      }
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += '; secure';
    }

    cookieString += `; samesite=${options.sameSite || this.sameSite}`;

    document.cookie = cookieString;
  }

  get(name: string): string | null {
    const decodedName = decodeURIComponent(name);
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(decodedName + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null;
  }

  delete(name: string, options: { path?: string; domain?: string } = {}): void {
    this.set(name, '', { ...options, expires: new Date(0) });
  }

  getAll(): { [key: string]: string } {
    return document.cookie.split(';').reduce(
      (cookies, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
        return cookies;
      },
      {} as { [key: string]: string },
    );
  }

  clearAll(): void {
    const cookies = this.getAll();
    for (const name in cookies) {
      this.delete(name);
    }
  }

  has(name: string): boolean {
    return this.get(name) !== null;
  }

  update(
    name: string,
    newValue: string,
    options: {
      expires?: number | Date;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'Lax' | 'Strict' | 'None';
    } = {},
  ): boolean {
    if (this.has(name)) {
      this.set(name, newValue, options);
      return true;
    }
    return false;
  }
}
