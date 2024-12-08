import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: '[meeOptionGroup]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>{{ label() }}</div>
    <ng-content />`,
})
export class MeeOptionGroup {
  label = input.required<string>();

  disabled = input<boolean>(false);
}
