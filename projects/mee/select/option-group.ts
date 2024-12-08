import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeOptionGroup } from '@meeui/adk/select';

@Component({
  selector: 'mee-option-group, [meeOptionGroup]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="sticky -top-b z-10 bg-foreground px-b2 py-b1.5 text-sm text-muted">
      {{ label() }}
    </div>
    <ng-content />`,
  host: {
    class: 'block',
  },
})
export class OptionGroup extends MeeOptionGroup {}
