import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: '[meeDialogTitle]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'text-lg font-semibold',
  },
})
export class DialogTitle {}
