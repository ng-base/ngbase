import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { generateId } from '../utils';

@Component({
  standalone: true,
  selector: 'mee-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div
      class="flex cursor-pointer items-center gap-b2"
      (click)="updateValue()"
    >
      <button
        class="custom-checkbox relative flex h-b4 w-b4 items-center justify-center rounded border border-text transition-colors"
        [class.bg-text]="value"
      >
        @if (value) {
          <svg class="h-full w-full text-foreground" viewBox="0 0 24 24">
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
            />
          </svg>
        }
      </button>
      <ng-content></ng-content>
    </div>
    <!-- <input
      type="checkbox"
      [(ngModel)]="value"
      (ngModelChange)="updateValue()"
      [id]="id"
      class="bg-background h-5 w-5"
    />
    <label [for]="id"><ng-content></ng-content></label> -->
  `,
  host: {
    class: 'inline-flex items-center gap-2 py-1',
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
  value: any;
  onChange = (value: any) => {};
  onTouched = () => {};

  constructor() {}

  updateValue() {
    this.value = !this.value;
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
