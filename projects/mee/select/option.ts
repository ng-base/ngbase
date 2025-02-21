import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbOption, NgbOptionGroup } from '@ngbase/adk/select';
import { Checkbox } from '@meeui/ui/checkbox';
import { ListStyle } from '@meeui/ui/list';

@Component({
  selector: 'mee-option, [meeOption]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ListStyle, { directive: NgbOption, inputs: ['value', 'disabled', 'ayId'] }],
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
  readonly option = inject(NgbOption<T>);
}

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
export class OptionGroup extends NgbOptionGroup {}
