import { inject, Injectable, signal } from '@angular/core';
import { isClient } from '@ngbase/adk/utils';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<'light' | 'dark' | ''>('light');

  constructor() {
    if (isClient()) {
      const theme = localStorage.getItem('theme');
      this._update((theme as 'light' | 'dark') || 'light');
    }
  }

  toggle() {
    this._update(this.mode() === 'dark' ? 'light' : 'dark');
  }

  private _update(mode: 'light' | 'dark' = 'light') {
    const body = document.body;
    if (mode === 'dark') {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    localStorage.setItem('theme', mode);
    this.mode.set(mode);
  }
}

export const injectTheme = () => inject(ThemeService);
