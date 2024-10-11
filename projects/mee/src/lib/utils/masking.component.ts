import {
  afterNextRender,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { isClient } from './ssr';

@Pipe({
  standalone: true,
  name: 'mask',
})
export class MaskPipe implements PipeTransform {
  transform(value: string, mask: string): string {
    return maskTransform(value, mask);
  }
}

@Directive({
  standalone: true,
  selector: '[meeMask]',
  host: {
    '(input)': 'onInput($event)',
    '(blur)': 'onTouched()',
  },
  // providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: MaskInput, multi: true }],
})
export class MaskInput {
  readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  readonly meeMask = input<string>('');
  readonly showMaskType = input(false);
  readonly control = inject(NgControl, { optional: true });
  private injector = inject(Injector);

  readonly value = model<string>('');
  private actualValue: string = '';
  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};
  private isClient = isClient();

  constructor() {
    this.control?.valueChanges?.subscribe(value => {
      this.writeValue(value);
    });
    effect(
      () => {
        const mask = this.meeMask();
        const value = this.value();
        if (value != this.actualValue) this.updateView(value, mask);
      },
      { allowSignalWrites: true },
    );
  }

  onInput(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    // const selectionStart = input.selectionStart;
    this.handleValue(input.value);
  }

  handleValue(value: string) {
    // Apply mask and update view
    const maskedValue = this.updateView(value);

    // Update actualValue
    this.actualValue = this.unmask(maskedValue);

    // Determine what changed
    // let insertedChar = '';
    // if (newValue.length > this.actualValue.length) {
    //   insertedChar = newValue.charAt(selectionStart! - 1);
    // }

    // Adjust cursor position
    // this.setCursorPosition(input, selectionStart!, insertedChar);

    this.onChange(this.actualValue);
    this.value.set(this.actualValue);
  }

  writeValue(value: string): void {
    this.actualValue = value || '';
    this.handleValue(this.actualValue);
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private updateView(value: string, mask = this.meeMask()): string {
    const maskedValue = maskTransform(value, mask);
    // we have to use microtask to update the value after the ngModel updates the value
    if (this.isClient) {
      afterNextRender(() => (this.el.nativeElement.value = maskedValue), {
        injector: this.injector,
      });
    }
    return maskedValue;
  }

  private unmask(value: string): string {
    return value.replace(/[^0-9a-zA-Z]/g, '');
  }

  private setCursorPosition(
    input: HTMLInputElement,
    selectionStart: number,
    insertedChar: string,
  ): void {
    const mask = this.meeMask();
    let adjustedPosition = selectionStart;

    if (insertedChar) {
      // Move cursor past any fixed mask characters
      while (adjustedPosition < mask.length && !'#a*'.includes(mask[adjustedPosition])) {
        adjustedPosition++;
      }
    } else {
      // Handle backspace: move cursor to previous input position
      while (adjustedPosition > 0 && !'#a*'.includes(mask[adjustedPosition - 1])) {
        adjustedPosition--;
      }
    }

    input.setSelectionRange(adjustedPosition, adjustedPosition);
  }
}

function maskTransform(value: string, mask: string, showMaskType = false): string {
  let result = '';
  let valueIndex = 0;

  for (let maskIndex = 0; maskIndex < mask.length && valueIndex < value.length; maskIndex++) {
    const maskChar = mask[maskIndex];
    const valueChar = value[valueIndex];

    switch (maskChar) {
      case '#':
        if (/\d/.test(valueChar)) {
          result += valueChar;
          valueIndex++;
        } else if (showMaskType) {
          result += '_';
        } else {
          return result;
        }
        break;
      case 'a':
        if (/[a-zA-Z]/.test(valueChar)) {
          result += valueChar;
          valueIndex++;
        } else if (showMaskType) {
          result += '_';
        } else {
          return result;
        }
        break;
      case '*':
        if (/[a-zA-Z0-9]/.test(valueChar)) {
          result += valueChar;
          valueIndex++;
        } else if (showMaskType) {
          result += '_';
        } else {
          return result;
        }
        break;
      default:
        result += maskChar;
        if (maskChar === valueChar && valueIndex === maskIndex) {
          valueIndex++;
        }
    }
  }

  return result;
}
