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
  styles: `
    :host {
      --nonchecked-color: #fbfbfb;
      --checked-color: #38f;
      @apply inline-flex items-center gap-2 py-1;
    }
    .switch {
      -webkit-appearance: none;
      position: relative;
      border-radius: 10px;
      width: 32px;
      height: 20px;
      border: solid 1px var(--nonchecked-color);
      background: var(--nonchecked-color);
      overflow: hidden;
      transition: all 0.1s ease-out;
    }
    .switch:checked {
      background: var(--checked-color);
      border: solid 1px var(--checked-color);
    }
    .switch:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2);
    }
    .switch:after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      transition: all 0.1s ease-out;
    }
    .switch:checked:after {
      left: 14px;
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
