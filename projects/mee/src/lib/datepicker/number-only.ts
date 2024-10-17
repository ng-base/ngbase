import { Directive, effect, ElementRef, inject, input, model } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[meeNumberOnly]',
  host: {
    '(input)': 'value.set($event.target.value)',
    '[value]': 'value()',
  },
})
export class NumberOnly {
  min = input<number | undefined>();
  max = input<number | undefined>();
  len = input<number | undefined>();
  el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  value = model<string>('');

  constructor() {
    effect(cleanup => {
      const el = this.el.nativeElement;
      el.addEventListener('keydown', this.onKeyDown);
      cleanup(() => el.removeEventListener('keydown', this.onKeyDown));
    });
  }

  private readonly allowedKeys = new Set([
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
  ]);

  onKeyDown = (e: KeyboardEvent) => {
    if (this.allowedKeys.has(e.key) || this.isCtrlKey(e)) return;
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) return e.preventDefault();

    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      return this.handleArrowUpDown(e);
    }

    if (!/^\d$/.test(e.key) || !this.validateValue(this.getNewValue(e))) {
      e.preventDefault();
    }
  };

  private isCtrlKey(e: KeyboardEvent): boolean {
    return ['a', 'c', 'x'].includes(e.key) && (e.ctrlKey || e.metaKey);
  }

  private handleArrowUpDown(e: KeyboardEvent) {
    e.preventDefault();
    const currentValue = this.el.nativeElement.value;
    const newValue = +currentValue + (e.key === 'ArrowUp' ? 1 : -1);
    if (this.validateValue(newValue.toString())) {
      this.value.set(newValue.toString().padStart(2, '0'));
    }
  }

  private getNewValue(e: KeyboardEvent): string {
    const { value, selectionStart, selectionEnd } = this.el.nativeElement;
    const start = selectionStart ?? value.length;
    const end = selectionEnd ?? value.length;
    return value.slice(0, start) + e.key + value.slice(end);
  }

  private validateValue(rawValue: string): boolean {
    const len = this.len();
    const value = +rawValue;
    const min = this.min();
    const max = this.max();

    if (len !== undefined && rawValue.length > len) return false;
    if (max !== undefined && value > max) return false;

    if (min !== undefined && value < min) {
      const potentialMax = Number(rawValue + '9'.repeat(len ? len - rawValue.length : 1));
      if (potentialMax < min) return false;
    }

    return true;
  }
}

export function padString(num: number | string): string {
  return num.toString().padStart(2, '0');
}
