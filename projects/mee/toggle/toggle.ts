import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbToggle } from '@ngbase/adk/toggle';

@Component({
  selector: 'button[meeToggle]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: NgbToggle, inputs: ['value'], outputs: ['valueChange'] }],
  template: `<ng-content />`,
  host: {
    class: 'block w-9 h-9 rounded relative aria-[pressed=true]:bg-foreground',
  },
})
export class Toggle {}
