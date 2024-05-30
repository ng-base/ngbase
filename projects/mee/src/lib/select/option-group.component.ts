import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-option-group, [meeOptionGroup]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="py-b/3 px-b text-sm font-bold">{{ label() }}</div>
    <ng-content></ng-content>`,
  host: {
    class: 'block',
  },
})
export class OptionGroup {
  label = input.required<string>();
}
