import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-option-group, [meeOptionGroup]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="py-b1.5 px-b2 text-sm text-muted sticky -top-b bg-foreground z-10">
      {{ label() }}
    </div>
    <ng-content />`,
  host: {
    class: 'block'
  }
})
export class OptionGroup {
  label = input.required<string>();

  disabled = input<boolean>(false);
}
