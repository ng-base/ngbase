import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeLabel } from '@meeui/adk/input';

@Component({
  selector: '[meeLabel]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'block font-medium text-left mx-b0.5',
  },
  hostDirectives: [MeeLabel],
})
export class Label {}
