import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

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
      class="h-5 w-5 text-blue-600"
    />
    <label [for]="id" class="text-gray-700"><ng-content></ng-content></label>
  `,
  styles: `
    :host {
      @apply inline-flex items-center gap-2 py-1;
    }
    input {
      @apply h-4 w-4 text-blue-600;
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
  id = Math.random().toString(36).substring(7);
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
