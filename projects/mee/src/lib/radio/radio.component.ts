import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { generateId } from '../utils';
import { RadioGroup } from './radio-group.component';
import { AccessibleItem } from '@meeui/a11y';

@Component({
  standalone: true,
  selector: 'mee-radio, [meeRadio]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccessibleItem],
  template: `
    <button
      type="button"
      class="custom-radio relative flex h-b4 w-b4 flex-none items-center justify-center rounded-full border border-primary"
      [class]="disabled() ? 'border-muted' : 'border-primary'"
      [attr.aria-checked]="checked()"
      meeAccessibleItem
      [ayId]="ayId()"
      [disabled]="disabled()"
      role="radio"
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
  readonly radio = inject(RadioGroup);
  readonly value = input<any>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly inputId = generateId();
  readonly checked = computed(() => this.value() === this.radio.value());
  readonly ayId = signal<string>('');

  updateValue(value: any) {
    // override the method in the RadioGroup component
  }
}
