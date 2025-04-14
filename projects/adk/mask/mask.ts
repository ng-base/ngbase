import {
  afterRenderEffect,
  Directive,
  ElementRef,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { InputBase } from '@ngbase/adk/form-field';

@Directive({
  selector: '[ngbMask]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(paste)': 'onPaste($event)',
  },
})
export class Mask {
  // Dependencies
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  readonly control = inject(NgControl, { optional: true });
  private readonly inputC = inject(InputBase);

  // Inputs
  readonly ngbMask = input<string>('');
  readonly showMaskType = input(false);

  readonly localValue = linkedSignal(() => (this.inputC.value() as string) ?? '');
  // private lastValue = '';

  constructor() {
    // this.control?.valueChanges?.subscribe(value => {
    //   if (value !== this.lastValue) this.handleValue(value);
    // });

    afterRenderEffect(() => {
      const mask = this.ngbMask();
      const value = this.localValue();
      this.el.nativeElement.value = this.updateView(value, mask);
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    // console.log('onKeyDown', event);
    const input = event.target as HTMLInputElement;
    const keyCode = event.key;

    // Allow navigation keys
    if (
      [
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
        'Tab',
        'Backspace',
        'Delete',
        'Shift',
        'Meta',
        'Control',
        'Alt',
        'Escape',
        'CapsLock',
      ].includes(keyCode)
    ) {
      return;
    }

    // allow selecting all text
    if (keyCode === 'a' && (event.metaKey || event.ctrlKey)) {
      return;
    }

    event.preventDefault();
    const cursorPos = input.selectionStart || 0;
    const key = event.key;

    // Get the current value and mask
    const currentValue = input.value;
    const mask = this.ngbMask();

    // Check if the key matches the mask at current position
    if (this.isValidChar(key, this.getCurrentMaskChar(mask, cursorPos))) {
      // Insert the character at cursor position
      const newValue =
        currentValue.substring(0, cursorPos) + key + currentValue.substring(cursorPos);

      this.handleValue(newValue, cursorPos);
    }
  }

  getCurrentMaskChar(mask: string, cursorPos: number): string {
    // we only have to check cursor position and have to skip non-mask characters
    for (let i = cursorPos; i < mask.length; i++) {
      if (mask[i] !== '#' && mask[i] !== 'a' && mask[i] !== '*') {
        continue;
      }
      return mask[i];
    }
    return '';
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const cursorPos = input.selectionStart || 0;
    const pastedText = event.clipboardData?.getData('text') || '';

    const currentValue = input.value;
    const beforeCursor = currentValue.substring(0, cursorPos);
    const afterCursor = currentValue.substring(cursorPos);

    const newValue = beforeCursor + pastedText + afterCursor;
    this.handleValue(newValue, cursorPos);
  }

  private isValidChar(char: string, maskChar: string): boolean {
    switch (maskChar) {
      case '#':
        return /\d/.test(char);
      case 'a':
        return /[a-zA-Z]/.test(char);
      case '*':
        return /[a-zA-Z0-9]/.test(char);
      default:
        return char === maskChar;
    }
  }

  handleValue(value: string, cursorPos?: number) {
    // Apply mask and update view
    const maskedValue = this.updateView(value);
    // Update actualValue
    const actualValue = this.unmask(maskedValue);

    this.updateLocalValue(actualValue, actualValue !== value);

    // Set cursor position after update
    // if (cursorPos !== undefined) {
    //   setTimeout(() => {
    //     const newPos = this.calculateCursorPosition(maskedValue, cursorPos);
    //     this.el.nativeElement.setSelectionRange(newPos, newPos);
    //   });
    // }
  }

  private calculateCursorPosition(maskedValue: string, oldPos: number): number {
    const mask = this.ngbMask();
    let newPos = oldPos;

    // Move cursor past any fixed mask characters
    while (newPos < mask.length && !'#a*'.includes(mask[newPos])) {
      newPos++;
    }

    return Math.min(newPos, maskedValue.length);
  }

  private updateLocalValue(value: string, emit = true) {
    this.inputC.setValue(value);
    // this.lastValue = value;
    this.localValue.set(value);
    if (emit) this.control?.control?.setValue(value);
  }

  writeValue(value: string): void {
    this.handleValue(value);
  }

  private updateView(value: string, mask = this.ngbMask()): string {
    return maskTransform(value, mask);
  }

  private unmask(value: string): string {
    const mask = this.ngbMask();
    let unmaskedValue = '';
    let valueIndex = 0;

    for (let maskIndex = 0; maskIndex < mask.length && valueIndex < value.length; maskIndex++) {
      const maskChar = mask[maskIndex];
      const valueChar = value[valueIndex];

      if ('#a*'.includes(maskChar)) {
        unmaskedValue += valueChar;
        valueIndex++;
      } else if (maskChar === valueChar) {
        valueIndex++;
      }
    }

    return unmaskedValue;
  }
}

export function maskTransform(value: string, mask: string, showMaskType = false): string {
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
