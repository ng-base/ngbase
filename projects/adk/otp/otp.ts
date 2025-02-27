import {
  afterRenderEffect,
  booleanAttribute,
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
import { provideValueAccessor } from '@ngbase/adk/utils';

@Directive({
  selector: 'input[ngbOtpInput]',
  host: {
    '[disabled]': 'otp.disabled() || undefined',
    style:
      'position: absolute; inset: 0; border: none; background: transparent; caret-color: transparent; outline: none; color: transparent; letter-spacing: -0.5rem;',
  },
})
export class NgbOtpInput {
  readonly otp = inject(NgbInputOtp);
  readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
}

@Directive({
  selector: '[ngbOtpValue]',
  host: {
    style: `pointer-events: none`,
    '[attr.data-focus]': 'focused() || undefined',
    '[attr.data-disabled]': 'otp.disabled() || undefined',
    'aria-hidden': 'true',
    tabindex: '-1',
  },
})
export class NgbOtpValue {
  readonly otp = inject(NgbInputOtp);
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
      const value = this.value();
      this.el.nativeElement.textContent = value && this.otp.masked() ? '•' : value;
    });
  }
}

@Directive({
  selector: '[ngbInputOtp]',
  providers: [_provide(NgbInputOtp)],
})
export class NgbInputOtp implements ControlValueAccessor {
  private readonly inputs = viewChild.required<NgbOtpInput>(NgbOtpInput);
  readonly _otpValues = viewChildren<NgbOtpValue>(NgbOtpValue);
  // private readonly

  readonly size = input<number[]>([4]);
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
        // const isPaste = (e.ctrlKey || e.metaKey) && e.key === 'v';
        // if (isPaste || ['Tab', 'Enter'].includes(e.key)) {
        //   // prevent default behavior for tab key
        //   return;
        // } else
        if (value && !['Tab', 'Enter', 'Backspace'].includes(e.key)) {
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
    // const value = values.length === this.no() ? values : '';
    // if (this.lastValue === value) {
    //   return;
    // }
    this.lastValue = values;
    this.onChange?.(values);
    this.onTouched?.();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}

function _provide(otp: typeof NgbInputOtp) {
  return [provideValueAccessor(otp)];
}

export function aliasInputOtp(otp: typeof NgbInputOtp) {
  return [_provide(otp), { provide: NgbInputOtp, useExisting: otp }];
}
