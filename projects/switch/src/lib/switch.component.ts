import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { generateId } from '../../../utils';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'mee-switch',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      type="checkbox"
      [(ngModel)]="value"
      (ngModelChange)="updateValue()"
      [id]="id"
      class="switch h-5 w-5 text-blue-600"
    />
    <label [for]="id" class="text-gray-700"><ng-content></ng-content></label>
  `,
  host: {
    class: 'inline-flex items-center gap-2 py-1',
  },
  styles: `
    .switch {
      -webkit-appearance: none;
      position: relative;
      border-radius: 10px;
      width: 36px;
      height: 20px;
      @apply border border-gray-300 bg-gray-300;
      overflow: hidden;
      transition: all 0.1s ease-out;

      &:checked {
        @apply border-primary bg-primary;
        &:after {
          left: 17px;
        }
      }
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      &:after {
        content: '';
        position: absolute;
        top: 1px;
        left: 1px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #fff;
        transition: all 0.1s ease-out;
      }
    }
  `,
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
