import { Directive, ElementRef, inject, input, output } from '@angular/core';

// allow only numbers in input field
@Directive({
  standalone: true,
  selector: '[meeNumberOnly]',
  host: {
    '(keydown)': 'onKeyDown($event)',
  },
})
export class NumberOnly {
  min = input<number>();
  max = input<number>();
  len = input<number>();
  el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  valueChanged = output<string>();

  onKeyDown(e: KeyboardEvent) {
    const key = e.key;
    const ctrlKey = e.ctrlKey || e.metaKey;
    if (
      // Allow: backspace, delete, tab, escape, enter
      ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(key) ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+X
      (['a', 'c', 'x'].includes(key) && ctrlKey) ||
      // Allow: home, end, left, right
      ['Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(key)
    ) {
      // let it happen, don't do anything
      return;
    }

    // Stop: Ctrl+V
    if (key === 'v' && ctrlKey) {
      e.preventDefault();
      return;
    }

    const isUp = key === 'ArrowUp';
    const isDown = key === 'ArrowDown';

    // Ensure that it is a number and stop the keypress, except the up and down arrow
    if (
      (e.shiftKey || (!isUp && !isDown && (key < '0' || key > '9'))) &&
      (key < '0' || key > '9')
    ) {
      return e.preventDefault();
    }

    const selection = document.getSelection();
    // selected text
    const selectedText = selection?.toString() || '';
    let rawValue = this.el.nativeElement.value;
    // cursor position
    const cursor = this.el.nativeElement.selectionStart ?? rawValue.length;

    // on arrow up and down increase and decrease the value
    if (isUp || isDown) {
      e.preventDefault();
      let v = Number(this.el.nativeElement.value);
      v += isUp ? 1 : -1;
      if (this.validateValue(String(v))) {
        this.valueChanged.emit(padString(v));
      }
      return;
    } else {
      if (selectedText) rawValue = rawValue.replace(selectedText, '');
      // add the current key to the rawValue with the cursor position
      rawValue = rawValue.slice(0, cursor) + e.key + rawValue.slice(cursor);
    }

    if (!this.validateValue(rawValue)) {
      e.preventDefault();
    }
  }

  validateValue(rawValue: string) {
    const len = this.len();
    if (len !== undefined && rawValue.length > len) {
      return false;
    }

    // check for min and max
    const value = Number(rawValue);
    const min = this.min();
    const max = this.max();

    // For max, we can check directly
    if (max !== undefined && value > max) {
      return false;
    }

    // For min, we need to be more permissive
    if (min !== undefined) {
      // If the value is already >= min, it's valid
      if (value >= min) return true;

      // If the value is < min, it might still be valid if more digits could be added
      // We'll check if adding a '9' to the end could potentially make it >= min
      const potentialMax = Number(rawValue + '9'.repeat(len ? len - rawValue.length : 1));
      if (potentialMax < min) {
        return false;
      }
    }

    return true;
  }
}

export function padString(num: number | string) {
  return num.toString().padStart(2, '0');
}
