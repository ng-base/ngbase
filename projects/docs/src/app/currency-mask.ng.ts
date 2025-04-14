import { Directive, ElementRef, forwardRef, input, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[numberFormat]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberFormatDirective),
      multi: true,
    },
  ],
  host: {
    '(input)': 'onInput($event.target.value)',
    '(blur)': 'onBlur()',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class NumberFormatDirective implements ControlValueAccessor {
  // Input signals with default values
  readonly decimals = input<number>(2);
  readonly decimalSeparator = input<string>('.');
  readonly thousandSeparator = input<string>(',');

  // Private members
  private onChange = (_: any) => {};
  private onTouched = () => {};
  private rawValue = '';
  private el = inject(ElementRef);

  private readonly specialKeys = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
  ];

  // Handles input changes
  onInput(value: string) {
    const position = this.el.nativeElement.selectionStart;
    const cleanedValue = this.cleanValue(value);

    if (this.isValidNumber(cleanedValue)) {
      this.rawValue = cleanedValue;
      this.formatDisplayValue(cleanedValue);
      this.onChange(this.rawValue);
      this.updateCursorPosition(value, position);
    }
  }

  // Handles keydown events to validate input
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.includes(event.key)) return;

    const value = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;

    // Handle decimal separator
    if (event.key === this.decimalSeparator()) {
      if (value.includes(this.decimalSeparator())) {
        event.preventDefault();
      }
      return;
    }

    // Only allow digits
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    // Check decimal digits limit
    if (this.isDecimalPartFull(value, position)) {
      event.preventDefault();
    }
  }

  // Handle blur event
  onBlur() {
    if (this.rawValue) {
      this.formatDisplayValue(this.rawValue);
    }
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: string) {
    if (value) {
      const cleanValue = this.cleanValue(value);
      this.rawValue = cleanValue;
      this.formatDisplayValue(cleanValue);
    } else {
      this.reset();
    }
  }

  private reset() {
    this.el.nativeElement.value = '';
    this.rawValue = '';
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.el.nativeElement.disabled = isDisabled;
  }

  // Private helper methods
  private cleanValue(value: string): string {
    return value.replace(
      new RegExp(`[^\\d${this.escapeRegExp(this.decimalSeparator())}]`, 'g'),
      '',
    );
  }

  private isValidNumber(value: string): boolean {
    const parts = value.split(this.decimalSeparator());
    return parts.length <= 2 && parts.every(part => /^\d*$/.test(part));
  }

  private formatDisplayValue(value: string) {
    if (!value) {
      this.reset();
      return;
    }

    const parts = value.split(this.decimalSeparator());
    let integerPart = parts[0]
      .replace(/^0+(?=\d)/, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator());
    const decimalPart = parts.length > 1 ? parts[1].substring(0, this.decimals()) : undefined;

    this.el.nativeElement.value =
      decimalPart !== undefined
        ? `${integerPart}${this.decimalSeparator()}${decimalPart}`
        : integerPart;
  }

  private updateCursorPosition(originalValue: string, originalPosition: number) {
    setTimeout(() => {
      const el = this.el.nativeElement;
      if (originalPosition === originalValue.length) {
        // If cursor was at the end, keep it at the end
        el.setSelectionRange(el.value.length, el.value.length);
        return;
      }

      // Calculate new cursor position based on thousand separators
      const oldSeparatorCount = this.countSeparators(originalValue.substring(0, originalPosition));
      const newValueUpToOldPos = el.value.substring(0, originalPosition + 1);
      const newSeparatorCount = this.countSeparators(newValueUpToOldPos);

      const newPosition = originalPosition + (newSeparatorCount - oldSeparatorCount);
      el.setSelectionRange(newPosition, newPosition);
    }, 0);
  }

  private countSeparators(value: string): number {
    const regex = new RegExp(this.escapeRegExp(this.thousandSeparator()), 'g');
    return (value.match(regex) || []).length;
  }

  private isDecimalPartFull(value: string, position: number): boolean {
    const decimalPos = value.indexOf(this.decimalSeparator());
    return (
      decimalPos !== -1 &&
      position > decimalPos &&
      value.substring(decimalPos + 1).length >= this.decimals()
    );
  }

  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
