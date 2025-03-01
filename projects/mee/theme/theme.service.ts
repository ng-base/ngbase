import { inject, Injectable, signal } from '@angular/core';
import { isClient } from '@ngbase/adk/utils';
import { dialogPortal } from '@meeui/ui/dialog';
import { ThemeComponent } from './theme.component';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  dialog = dialogPortal();
  mode = signal<'light' | 'dark' | ''>('light');

  constructor() {
    if (isClient()) {
      const theme = localStorage.getItem('theme');
      this._update((theme as 'light' | 'dark') || 'light');

      // registerShortcut('ctrl+h', () => this.open());
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

  open() {
    this.dialog.open(ThemeComponent, {
      title: 'Theme',
      backdrop: false,
      width: '20rem',
    });
  }
}

export const injectTheme = () => inject(ThemeService);
