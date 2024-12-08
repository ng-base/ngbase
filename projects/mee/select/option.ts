import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MeeOption } from '@meeui/adk/select';
import { Checkbox } from '@meeui/ui/checkbox';
import { ListStyle } from '@meeui/ui/list';

@Component({
  selector: 'mee-option, [meeOption]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ListStyle, { directive: MeeOption, inputs: ['value', 'disabled', 'ayId'] }],
  imports: [Checkbox],
  template: ` @if (option.multiple()) {
      <mee-checkbox [checked]="option.checked()" class="!py-0" />
    }
    <ng-content />`,
  host: {
    '[class.bg-muted-background]': 'option.active() || option.checked()',
  },
})
export class Option<T> {
  readonly option = inject(MeeOption<T>);
}
