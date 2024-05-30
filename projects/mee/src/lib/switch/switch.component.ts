import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { generateId } from '../utils';
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
      class="switch relative box-content h-6 w-11 overflow-hidden rounded-full border border-border bg-input"
    />
    <label [for]="id"><ng-content></ng-content></label>
  `,
  host: {
    class: 'inline-flex items-center gap-2 py-1',
  },
  styles: `
    .switch {
      -webkit-appearance: none;

      &:checked {
        @apply border-primary bg-primary;
        &:after {
          @apply left-[calc(100%-1.375rem)];
        }
      }
      &:after {
        content: '';
        position: absolute;
        @apply left-0.5 top-0.5 h-5 w-5 rounded-full bg-foreground;
        transition: all 0.2s ease-out;
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
