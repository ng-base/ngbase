import { ChangeDetectionStrategy, Component, forwardRef, model, output } from '@angular/core';
import { generateId } from '../utils';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'mee-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      role="switch"
      (click)="updateValue()"
      [id]="id"
      class="relative h-b5 w-b9 rounded-full border-b0.5 border-transparent bg-muted-background transition-colors"
      [class.bg-primary]="checked()"
    >
      <span
        class="block h-b4 w-b4 rounded-full bg-foreground transition-transform"
        [class]="checked() ? 'translate-x-full' : ''"
      ></span>
    </button>
    <label [for]="id"><ng-content></ng-content></label>
  `,
  host: {
    class: 'inline-flex items-center gap-b2 py-b',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Switch),
      multi: true,
    },
  ],
})
export class Switch implements ControlValueAccessor {
  id = generateId();
  change = output<boolean>();
  checked = model(false);

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor() {}

  updateValue() {
    this.checked.update(v => !v);
    const checked = this.checked();
    this.onChange(checked);
    this.onTouched();
    this.change.emit(checked);
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
