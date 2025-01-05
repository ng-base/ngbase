import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor, RangePipe } from '@meeui/adk/utils';

@Directive({
  selector: '[meeOtpInput]',
  host: {
    '[placeholder]': 'otp.placeholder()',
    '[type]': 'otp.masked() ? "password" : "text"',
    '[disabled]': 'otp.disabled()',
  },
})
export class MeeOtpInput {
  readonly otp = inject(MeeInputOtp);
}

@Component({
  selector: '[meeInputOtp]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [_provide(MeeInputOtp)],
  imports: [RangePipe, MeeOtpInput],
  template: `
    @for (num of size(); track $index; let l = $last) {
      @for (n of num | range; track n; let i = $index; let ll = $last) {
        <input meeOtpInput />
      }
      @if (!l) {
        <div>{{ separator() }}</div>
      }
    }
  `,
})
export class MeeInputOtp implements ControlValueAccessor {
  private readonly inputs = viewChildren<MeeOtpInput, ElementRef<HTMLInputElement>>(MeeOtpInput, {
    read: ElementRef,
  });

  readonly size = input<number[]>([4]);
  readonly placeholder = input('·');
  readonly separator = input('-');
  readonly masked = input(false, { transform: booleanAttribute });
  readonly disabled = input<boolean>(false);

  private readonly no = computed(() => this.size().reduce((a, b) => a + b, 0));
  private onChange?: (value: string) => void;
  private onTouched?: () => void;
  private lastValue = '';

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

function _provide(otp: typeof MeeInputOtp) {
  return [provideValueAccessor(otp)];
}

export function provideInputOtp(otp: typeof MeeInputOtp) {
  return [_provide(otp), { provide: MeeInputOtp, useExisting: otp }];
}
