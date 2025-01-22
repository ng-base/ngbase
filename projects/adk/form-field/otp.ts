import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor, RangePipe } from '@meeui/adk/utils';

@Directive({
  selector: 'input[meeOtpInput]',
  host: {
    '[placeholder]': 'otp.placeholder()',
    '[type]': 'otp.masked() ? "password" : "text"',
    '[disabled]': 'otp.disabled() || undefined',
    style:
      'position: absolute; inset: 0; border: none; background: transparent; caret-color: transparent; outline: none; color: transparent; letter-spacing: -0.5rem;',
  },
})
export class MeeOtpInput {
  readonly otp = inject(MeeInputOtp);
  readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
}

@Directive({
  selector: '[meeOtpValue]',
  host: {
    style: `pointer-events: none`,
    '[attr.data-focus]': 'focused() || undefined',
    '[attr.data-disabled]': 'otp.disabled() || undefined',
    'aria-hidden': 'true',
    '[type]': 'otp.masked() ? "password" : "text"',
    tabindex: '-1',
  },
})
export class MeeOtpValue {
  readonly otp = inject(MeeInputOtp);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly index = computed(() => this.otp._otpValues().findIndex(v => this.el === v.el));
  readonly value = computed(() => this.otp.values()[this.index()] || '');

  readonly focused = computed(() => {
    return (
      this.otp.focused() && this.index() === Math.min(this.otp.values().length, this.otp.no() - 1)
    );
  });

  constructor() {
    effect(() => {
      this.el.nativeElement.textContent = this.otp.masked() ? '•' : this.value();
    });
  }
}

@Component({
  selector: '[meeInputOtp]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [_provide(MeeInputOtp)],
  imports: [RangePipe, MeeOtpInput, MeeOtpValue],
  template: `
    @for (num of size(); track $index; let l = $last) {
      @for (n of num | range; track n; let i = $index; let ll = $last) {
        <input meeOtpValue />
      }
      @if (!l) {
        <div>{{ separator() }}</div>
      }
    }
    <input meeOtpInput />
  `,
})
export class MeeInputOtp implements ControlValueAccessor {
  private readonly inputs = viewChild.required<MeeOtpInput>(MeeOtpInput);
  readonly _otpValues = viewChildren<MeeOtpValue>(MeeOtpValue);
  // private readonly

  readonly size = input<number[]>([4]);
  readonly placeholder = input('·');
  readonly separator = input('-');
  readonly masked = input(false, { transform: booleanAttribute });
  readonly disabled = input<boolean>(false);

  readonly no = computed(() => this.size().reduce((a, b) => a + b, 0));
  private onChange?: (value: string) => void;
  private onTouched?: () => void;
  private lastValue = '';
  readonly values = signal<string>('');
  readonly focused = signal<boolean>(false);

  constructor() {
    afterRenderEffect(cleanup => {
      const inputEl = this.inputs().el.nativeElement;

      const inputListener = () => {
        const value = inputEl.value;
        this.updateValue(value);
      };

      const keydownListener = (e: KeyboardEvent) => {
        const value = inputEl.value.length === this.no();
        const isBackspace = e.key === 'Backspace';
        // const isPaste = (e.ctrlKey || e.metaKey) && e.key === 'v';
        // if (isPaste || ['Tab', 'Enter'].includes(e.key)) {
        //   // prevent default behavior for tab key
        //   return;
        // } else
        if (!isBackspace && value) {
          // prevent default behavior for non-numeric characters
          e.preventDefault();
        }
      };

      const pasteListener = (e: ClipboardEvent) => {
        e.preventDefault();

        const pastedText = e.clipboardData?.getData('text') || '';
        const numbers = pastedText.replace(/\D/g, '');

        // Only process if we have valid numbers
        if (numbers.length === 0) return;

        this.updateNewValue(numbers.slice(0, this.no()));
        this.updateValue(inputEl.value);
      };

      const blurListener = () => {
        // We have to use untracked because the blur is triggered by the input element when we make it disabled
        // so we are getting cannot update signal inside computed error
        untracked(() => this.focused.set(false));
      };

      const focusListener = () => {
        this.focused.set(true);
        // set the cursor to the end of the input
        inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length;
      };

      inputEl.addEventListener('input', inputListener);
      inputEl.addEventListener('focus', focusListener);
      inputEl.addEventListener('blur', blurListener);
      inputEl.addEventListener('keydown', keydownListener);
      inputEl.addEventListener('paste', pasteListener);

      cleanup(() => {
        inputEl.removeEventListener('input', inputListener);
        inputEl.removeEventListener('focus', focusListener);
        inputEl.removeEventListener('blur', blurListener);
        inputEl.removeEventListener('keydown', keydownListener);
        inputEl.removeEventListener('paste', pasteListener);
      });
    });
  }

  private updateNewValue(value: string) {
    this.values.set(value);
    this.inputs().el.nativeElement.value = value;
  }

  writeValue(value: string) {
    const values = value || '';
    this.lastValue = value;
    this.updateNewValue(values);
  }

  updateValue(values: string) {
    this.values.set(values);
    const value = values.length === this.no() ? values : '';
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
