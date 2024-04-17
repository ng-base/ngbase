import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mee-card',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      @apply block rounded-md border bg-bg-primary p-4;
    }
  `,
})
export class Card {}
