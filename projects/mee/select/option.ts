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
    class: 'outline-none',
    '[class.bg-muted]': 'option.active() || option.checked()',
  },
})
export class Option<T> {
  readonly option = inject(NgbOption<T>);
}

@Component({
  selector: 'mee-option-group, [meeOptionGroup]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="text-muted-foreground bg-popover sticky -top-1 z-10 px-2 py-1.5 text-sm">
      {{ label() }}
    </div>
    <ng-content />`,
  host: {
    class: 'block',
  },
})
export class OptionGroup extends NgbOptionGroup {}
