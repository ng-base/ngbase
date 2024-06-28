import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { generateId } from '../utils';
import { RadioGroup } from './radio-group.component';

@Component({
  standalone: true,
  selector: 'mee-radio, [meeRadio]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="custom-radio relative flex h-b4 w-b4 flex-none items-center justify-center rounded-full border border-primary"
      [class]="disabled() ? 'border-muted' : 'border-primary'"
    >
      @if (checked()) {
        <div class="h-b2 w-b2 rounded-full" [class]="disabled() ? 'bg-muted' : 'bg-primary'"></div>
      }
    </button>
    <ng-content></ng-content>
  `,
  host: {
    class: 'flex items-center gap-b2 py-1',
    '(click)': '!disabled() && updateValue($event)',
    '[class]': `disabled() ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'`,
  },
})
export class Radio {
  value = input<any>();
  disabled = input<boolean>(false);
  radio = inject(RadioGroup);
  inputId = generateId();
  checked = computed(() => this.value() === this.radio.value());
  name = '';

  updateValue(value: any) {}
}
