import { NgClass } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor, RangePipe } from '@meeui/adk/utils';
import { InputStyle } from './input-style.directive';

@Component({
  selector: 'mee-input-otp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputStyle, RangePipe, NgClass],
  template: `
    @for (num of size(); track $index; let l = $last) {
      @for (n of num | range; track n; let i = $index; let ll = $last) {
        <input
          #input
          meeInputStyle
          [placeholder]="placeholder()"
          [type]="mask() ? 'password' : 'text'"
          [ngClass]="{ '!rounded-l-lg': i === 0, '!rounded-r-lg': ll }"
          class="mb-0 aspect-square w-10 rounded-none !px-0 text-center text-base font-semibold"
        />
      }
      @if (!l) {
        <div class="px-2">{{ separator() }}</div>
      }
    }
  `,
  host: {
    class: 'inline-flex items-center justify-center rounded-base',
  },
  providers: [provideValueAccessor(InputOtp)],
})
export class InputOtp implements ControlValueAccessor {
  readonly inputs = viewChildren<ElementRef<HTMLInputElement>>('input');

  readonly size = input<number[]>([4]);
  readonly placeholder = input('·');
  readonly separator = input('-');
  readonly mask = input(false, { transform: booleanAttribute });

  readonly no = computed(() => this.size().reduce((a, b) => a + b, 0));
  onChange?: (value: string) => void;
  onTouched?: () => void;
  lastValue = '';

  constructor() {
    afterRenderEffect(cleanup => {
      const values = Array.from({ length: this.no() }, () => '');
      const inputs = this.inputs();
      this.updateTabIndex(values);
      // update values on input

      inputs.forEach((input, i) => {
        const inputEl = input.nativeElement;
        const inputListener = () => {
          const currentVal = values[i];
          const value = inputEl.value;
          values[i] = value;

          let index = i;
          if (value && i < this.no() - 1) {
            index = i + 1;
            inputs[index].nativeElement.focus();
          } else if (!value && i > 0 && !currentVal) {
            index = i - 1;
            inputs[index].nativeElement.focus();
          }
          if (values.every(v => v)) {
            this.updateValue(values.join(''));
          } else {
            this.updateValue('');
          }
          // update tabindex
          // const index = this.values.findIndex(v => !v);
          this.updateTabIndex(values);
        };

        const focusListener = () => {
          let index = values.findIndex(v => !v);
          index = index === -1 ? values.length - 1 : index;
          const el = inputs[index].nativeElement;
          el.focus();
          el.style.position = 'relative';

          // move the cursor to the end of the input
          // wait for the next frame to set the cursor position
          requestAnimationFrame(() => {
            el.selectionStart = el.selectionEnd = el.value.length;
          });
        };

        const keydownListener = (e: KeyboardEvent) => {
          const value = inputEl.value;
          const isBackspace = e.key === 'Backspace';
          const isTab = e.key === 'Tab';
          if (isTab) {
            return;
          } else if (isBackspace && !value && i > 0) {
            const el = inputs[i - 1].nativeElement;
            values[i - 1] = '';
            el.value = '';
            el.focus();
            this.updateTabIndex(values);
          } else if (!isBackspace && (value || isNaN(Number(e.key)))) {
            e.preventDefault();
          }
        };

        const blurListener = () => {
          inputEl.style.position = '';
        };

        inputEl.addEventListener('input', inputListener);
        inputEl.addEventListener('focus', focusListener);
        inputEl.addEventListener('blur', blurListener);
        inputEl.addEventListener('keydown', keydownListener);

        // remove event listener
        cleanup(() => {
          inputEl.removeEventListener('input', inputListener);
          inputEl.removeEventListener('focus', focusListener);
          inputEl.removeEventListener('blur', blurListener);
          inputEl.removeEventListener('keydown', keydownListener);
        });
      });
    });
  }

  private updateTabIndex(values: string[]) {
    let index = values.findIndex(v => !v);
    const inputs = this.inputs();
    index = Math.min(inputs.length - 1, index === -1 ? inputs.length - 1 : index);
    inputs.forEach((el, j) => {
      el.nativeElement.tabIndex = j === index ? 0 : -1;
    });
  }

  writeValue(value: string) {
    const values = value ? value.split('') : Array.from({ length: this.no() }, () => '');
    this.lastValue = value;
    this.inputs().forEach((input, i) => {
      input.nativeElement.value = values[i] ?? '';
    });
  }

  updateValue(value: string) {
    if (this.lastValue === value) {
      return;
    }
    this.lastValue = value;
    this.onChange?.(value);
    this.onTouched?.();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
