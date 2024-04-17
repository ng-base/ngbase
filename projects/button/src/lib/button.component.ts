import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'button[meeButton], a[meeButton]',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      @apply inline-block rounded-lg bg-blue-500 px-4 py-1 text-white hover:bg-blue-700 active:bg-blue-800;
    }
  `,
})
export class Button {}
