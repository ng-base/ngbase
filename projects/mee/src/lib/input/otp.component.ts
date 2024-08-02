import {
  Component,
  viewChildren,
  ElementRef,
  forwardRef,
  input,
  computed,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';
import { InputStyle } from './input-style.directive';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RangePipe } from '../utils';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'mee-input-otp',
  imports: [InputStyle, RangePipe, NgClass],
  template: `
    @for (num of size(); track $index; let l = $last) {
      @for (n of num | range; track n; let i = $index; let ll = $last) {
        <input
          #input
          meeInputStyle
          type="text"
          [ngClass]="{ '!rounded-l-lg': i === 0, '!rounded-r-lg': ll }"
          class="mb-0 aspect-square w-10 rounded-none !px-0 text-center text-base font-semibold"
        />
      }
      @if (!l) {
        <div class="px-2">-</div>
      }
    }
  `,
  host: {
    class: 'inline-flex items-center',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputOtp),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOtp implements ControlValueAccessor {
  inputs = viewChildren<ElementRef<HTMLInputElement>>('input');
  size = input<number[]>([4]);
  no = computed(() => this.size().reduce((a, b) => a + b, 0));
  // nums = Array.from({ length: this.no() }, (_, i) => i);
  values: string[] = [];
  onChange = (value: string) => {};
  onTouched = () => {};
  lastValue = '';

  constructor() {
    let listeners: VoidFunction[] = [];
    effect(
      cleanup => {
        cleanup(() => {
          listeners.forEach(l => l());
          this.values = [];
        });
        this.values = Array.from({ length: this.no() }, () => '');
        const inputs = this.inputs();
        this.updateTabIndex();
        // update values on input

        inputs.forEach((input, i) => {
          const inputEl = input.nativeElement;
          const inputListener = () => {
            const currentVal = this.values[i];
            const value = inputEl.value;
            this.values[i] = value;

            let index = i;
            if (value && i < this.no() - 1) {
              index = i + 1;
              inputs[index].nativeElement.focus();
            } else if (!value && i > 0 && !currentVal) {
              index = i - 1;
              inputs[index].nativeElement.focus();
            }
            if (this.values.every(v => v)) {
              this.updateValue(this.values.join(''));
            } else {
              this.updateValue('');
            }
            // update tabindex
            // const index = this.values.findIndex(v => !v);
            this.updateTabIndex();
          };

          const focusListener = () => {
            let index = this.values.findIndex(v => !v);
            index = index === -1 ? this.no() - 1 : index;
            inputs[index].nativeElement.focus();
            inputs[index].nativeElement.style.position = 'relative';
          };

          const keydownListener = (e: KeyboardEvent) => {
            const value = inputEl.value;
            const isBackspace = e.key === 'Backspace';
            const isTab = e.key === 'Tab';
            if (isTab) {
              return;
            } else if (isBackspace && !value && i > 0) {
              const el = inputs[i - 1].nativeElement;
              this.values[i - 1] = '';
              el.value = '';
              el.focus();
              this.updateTabIndex();
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
          listeners.push(() => {
            inputEl.removeEventListener('input', inputListener);
            inputEl.removeEventListener('focus', focusListener);
            inputEl.removeEventListener('blur', blurListener);
            inputEl.removeEventListener('keydown', keydownListener);
          });
        });
      },
      { allowSignalWrites: true },
    );
  }

  private updateTabIndex() {
    let index = this.values.findIndex(v => !v);
    const inputs = this.inputs();
    index = Math.min(inputs.length - 1, index === -1 ? inputs.length - 1 : index);
    inputs.forEach((el, j) => {
      el.nativeElement.tabIndex = j === index ? 0 : -1;
    });
  }

  writeValue(value: string) {
    this.values = value ? value.split('') : Array.from({ length: this.no() }, () => '');
    this.lastValue = value;
    this.inputs().forEach((input, i) => {
      input.nativeElement.value = this.values[i] ?? '';
    });
  }

  updateValue(value: string) {
    if (this.lastValue === value) {
      return;
    }
    this.lastValue = value;
    this.onChange(value);
    this.onTouched();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
