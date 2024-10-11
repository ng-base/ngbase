import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: '[meeLabel]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'flex flex-col font-medium mb-b2 gap-b',
  },
})
export class Label {}
