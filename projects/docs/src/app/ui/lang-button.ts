import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectDirectionality } from '@meeui/adk/bidi';
import { isClient } from '@meeui/adk/utils';
import { Button } from '@meeui/ui/button';

@Component({
  selector: 'app-lang',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  template: `<button meeButton="ghost" (click)="toggleDirection()">
    {{ dir.isRtl() ? 'RTL' : 'LTR' }}
  </button>`,
})
export class LangButton {
  readonly dir = injectDirectionality();

  constructor() {
    if (isClient()) {
      localStorage.getItem('dir') === 'rtl'
        ? this.dir.setDirection(true)
        : this.dir.setDirection(false);
    }
  }

  toggleDirection() {
    this.dir.toggleDirection();
    localStorage.setItem('dir', this.dir.isRtl() ? 'rtl' : 'ltr');
  }
}
