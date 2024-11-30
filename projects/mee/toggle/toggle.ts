import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeToggle } from '@meeui/adk/toggle';

@Component({
  selector: 'button[meeToggle]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: MeeToggle, inputs: ['value'], outputs: ['valueChange'] }],
  template: `<ng-content />`,
  host: {
    class: 'block w-9 h-9 rounded relative aria-[pressed=true]:bg-background',
  },
})
export class Toggle {}
