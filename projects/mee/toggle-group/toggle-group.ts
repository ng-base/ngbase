import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeToggleGroup } from '@meeui/adk/toggle-group';

@Component({
  selector: 'mee-toggle-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: MeeToggleGroup, inputs: ['value'], outputs: ['valueChange'] }],
  template: ` <ng-content select="[meeToggleItem]" /> `,
  host: {
    class: 'flex gap-1',
  },
})
export class ToggleGroup<T> {}
