import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Directionality {
  private document = inject(DOCUMENT);
  private readonly direction = signal<'rtl' | 'ltr'>(this.getInitialDirection());
  readonly isRtl = computed(() => this.direction() === 'rtl');

  constructor() {
    this.updateDir(this.direction() === 'rtl');
  }

  private getInitialDirection(): 'rtl' | 'ltr' {
    return this.document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
    // return 'rtl';
  }

  setDirection(isRtl: boolean): void {
    this.direction.set(isRtl ? 'rtl' : 'ltr');
    this.updateDir(isRtl);
  }

  toggleDirection(): void {
    this.direction.update(value => (value === 'rtl' ? 'ltr' : 'rtl'));
    this.updateDir(this.direction() === 'rtl');
  }

  private updateDir(isRtl: boolean): void {
    const dir = isRtl ? 'rtl' : 'ltr';
    this.document.documentElement.setAttribute('dir', dir);
  }
}

export const injectDirectionality = () => inject(Directionality);
