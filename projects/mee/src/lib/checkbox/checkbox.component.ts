import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { generateId } from '../utils';

@Component({
  standalone: true,
  selector: 'mee-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="flex flex-1 items-center gap-b2" (click)="updateValue()">
      <button
        class="custom-checkbox relative flex h-b4 w-b4 flex-none items-center justify-center rounded border border-primary transition-colors"
        [class]="disabled() ? '!border-muted bg-muted' : checked() ? 'bg-primary' : ''"
        [tabIndex]="disabled() ? -1 : 0"
        [attr.aria-checked]="checked()"
        [attr.aria-disabled]="disabled()"
        role="checkbox"
      >
        @if (checked()) {
          <svg class="h-full w-full text-foreground" viewBox="0 0 24 24">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" fill="none" />
          </svg>
        }
      </button>
      <ng-content></ng-content>
    </div>
  `,
  host: {
    class: 'inline-flex items-center gap-2 py-1',
    '[class]': `disabled() ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'`,
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox),
      multi: true,
    },
  ],
})
export class Checkbox implements ControlValueAccessor {
  id = generateId();
  disabled = input(false);
  checked = model(false);
  change = output<boolean>();
  indeterminate = input(false);
  onChange = (value: any) => {};
  onTouched = () => {};

  constructor() {}

  updateValue() {
    if (this.disabled()) {
      return;
    }
    const value = !this.checked();
    this.checked.set(value);
    this.onChange(value);
    this.onTouched();
    this.change.emit(value);
  }

  writeValue(value: any): void {
    this.checked.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
