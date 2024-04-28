import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { generateId } from '../utils';

@Component({
  selector: 'mee-checkbox',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      type="checkbox"
      [(ngModel)]="value"
      (ngModelChange)="updateValue()"
      [id]="id"
      class="bg-background h-5 w-5"
    />
    <label [for]="id"><ng-content></ng-content></label>
  `,
  host: {
    class: 'inline-flex items-center gap-2 py-1',
  },
  styles: `
    input {
      @apply h-4 w-4 text-primary;
    }
  `,
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
  value: any;
  onChange = (value: any) => {};
  onTouched = () => {};

  constructor() {}

  updateValue() {
    this.onChange(this.value);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
