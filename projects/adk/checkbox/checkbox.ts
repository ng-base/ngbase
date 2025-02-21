import { Directive, inject, input, model, output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor, uniqueId } from '@ngbase/adk/utils';

@Directive({
  selector: '[ngbCheckboxButton]',
  host: {
    role: 'checkbox',
    type: 'button',
    '[disabled]': 'checkbox.disabled()',
    '[tabIndex]': 'checkbox.disabled() ? -1 : 0',
    '[attr.aria-checked]': 'checkbox.checked()',
    '[attr.aria-disabled]': 'checkbox.disabled()',
  },
})
export class CheckboxButton {
  readonly checkbox = inject(NgbCheckbox);
}

@Directive({
  selector: '[ngbCheckbox]',
  host: {
    '(click)': 'updateValue()',
  },
  providers: [provideValueAccessor(NgbCheckbox)],
})
export class NgbCheckbox implements ControlValueAccessor {
  readonly id = uniqueId();
  readonly disabled = input(false);
  readonly checked = model(false);
  readonly change = output<boolean>();
  readonly indeterminate = input(false);
  onChange = (_: any) => {};
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
