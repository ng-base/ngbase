import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'mee-mask-input',
  template: ` <input [type]="type" [value]="value" (input)="onInput($event)" (blur)="onBlur()" /> `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskInputComponent),
      multi: true,
    },
  ],
})
export class MaskInputComponent implements ControlValueAccessor {
  @Input() mask: string = '';
  @Input() type: string = 'text';

  value: string = '';
  onChange: any = () => {};
  onTouch: any = () => {};

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let inputValue = input.value;
    let maskedValue = this.applyMask(inputValue);

    input.value = maskedValue;
    this.value = maskedValue;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouch();
  }

  writeValue(value: string): void {
    if (value) {
      this.value = this.applyMask(value);
    } else {
      this.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  applyMask(value: string): string {
    let result = '';
    let maskIndex = 0;
    let valueIndex = 0;

    while (maskIndex < this.mask.length && valueIndex < value.length) {
      const maskChar = this.mask[maskIndex];
      const valueChar = value[valueIndex];

      switch (maskChar) {
        case '#':
          if (/\d/.test(valueChar)) {
            result += valueChar;
            valueIndex++;
          } else {
            return result;
          }
          break;
        case 'a':
          if (/[a-zA-Z]/.test(valueChar)) {
            result += valueChar;
            valueIndex++;
          } else {
            return result;
          }
          break;
        case '*':
          if (/[a-zA-Z0-9]/.test(valueChar)) {
            result += valueChar;
            valueIndex++;
          } else {
            return result;
          }
          break;
        default:
          if (valueChar === maskChar) {
            result += maskChar;
            valueIndex++;
          } else {
            result += maskChar;
          }
      }
      maskIndex++;
    }

    return result;
  }
}
