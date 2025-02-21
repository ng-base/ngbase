import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: '[ngbOptionGroup]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>{{ label() }}</div>
    <ng-content />`,
})
export class NgbOptionGroup {
  label = input.required<string>();

  disabled = input<boolean>(false);
}
