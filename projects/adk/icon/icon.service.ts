import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type IconLoaderFn = (name: string) => Promise<string>;

export const ICON_LOADER = new InjectionToken<IconLoaderFn>('ICON_LOADER', {
  providedIn: 'root',
  factory: iconLoader,
});

function iconLoader(): IconLoaderFn {
  const http = inject(HttpClient, { optional: true });
  return async (name: string) => {
    try {
      if (http) {
        const icon = await firstValueFrom(
          http?.get(`/icons/${name}.svg`, { responseType: 'text' }),
        );
        return icon;
      }
    } catch (error) {
      console.error(`Failed to load icon ${name}`, error);
    }
    return '';
  };
}

@Injectable({ providedIn: 'root' })
export class IconService {
  readonly loader = inject(ICON_LOADER);
  readonly icons = new Map<string, string>();
  private readonly pendingRequests = new Map<string, Promise<string>>();

  async getIcon(name: string): Promise<string> {
    const cachedIcon = this.icons.get(name);

    if (cachedIcon) {
      return cachedIcon;
    }

    let pendingRequest = this.pendingRequests.get(name);
    if (!pendingRequest) {
      pendingRequest = this.loader(name);
      this.pendingRequests.set(name, pendingRequest);

      try {
        const icon = await pendingRequest;
        this.icons.set(name, icon);
        return icon;
      } finally {
        this.pendingRequests.delete(name);
      }
    }

    return pendingRequest;
  }
}
