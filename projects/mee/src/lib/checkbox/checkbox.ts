import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { ControlValueAccessor, FormsModule } from '@angular/forms';
import { provideValueAccessor, uniqueId } from '../utils';
import { FocusStyle } from './focus-style.directive';

@Component({
  selector: 'mee-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, FocusStyle],
  template: `
    <button
      meeFocusStyle
      type="button"
      class="custom-checkbox relative flex h-b4 w-b4 flex-none items-center justify-center rounded border border-primary transition-colors"
      [class]="disabled() ? '!border-muted bg-muted' : path() ? 'bg-primary' : ''"
      [tabIndex]="disabled() ? -1 : 0"
      [attr.aria-checked]="checked()"
      [attr.aria-disabled]="disabled()"
      role="checkbox"
    >
      @if (path()) {
        <svg class="h-full w-full text-foreground" viewBox="0 0 24 24" aria-hidden="true">
          <path [attr.d]="path()" stroke="currentColor" stroke-width="2" fill="none" />
        </svg>
      }
    </button>
    <ng-content />
  `,
  host: {
    class: 'inline-flex items-center gap-b2 py-1',
    '[class]': `disabled() ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'`,
    '(click)': 'updateValue()',
  },
  providers: [provideValueAccessor(Checkbox)],
  standalone: true,
})
export class Checkbox implements ControlValueAccessor {
  readonly id = uniqueId();
  readonly disabled = input(false);
  readonly checked = model(false);
  readonly change = output<boolean>();
  readonly indeterminate = input(false);
  readonly path = computed(() =>
    this.indeterminate() ? 'M6 12L18 12' : this.checked() ? 'M20 6L9 17L4 12' : '',
  );
  onChange = (value: any) => {};
  onTouched = () => {};

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
