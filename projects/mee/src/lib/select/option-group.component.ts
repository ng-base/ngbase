import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-option-group, [meeOptionGroup]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="py-b1.5 px-b2 text-sm text-muted">{{ label() }}</div>
    <ng-content />`,
  host: {
    class: 'block',
  },
})
export class OptionGroup {
  label = input.required<string>();
}
