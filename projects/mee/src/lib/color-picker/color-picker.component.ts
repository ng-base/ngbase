import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { InputStyle } from '../input/input-style.directive';

@Component({
  selector: 'mee-color-picker',
  standalone: true,
  imports: [FormsModule, InputStyle],
  template: `
    <div class="customColorInput flex items-center gap-1" meeInputStyle>
      <label for="colorCodePreview" class="visually-hidden">Color's code</label>
      <input
        type="text"
        #colorCodePreview
        name="themeIconLightBg"
        class="customColorInput__text-input jsColorValue"
        [(ngModel)]="value"
      />

      <label for="colorCodeSelection" class="visually-hidden">
        Color Selection
      </label>
      <input
        type="color"
        #colorCodeSelection
        class="customColorInput__select-input"
        [(ngModel)]="value"
      />
    </div>
  `,
  host: {
    class: 'block relative rounded-lg',
  },
  styles: `
    .visually-hidden {
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
      position: absolute !important;
    }

    // for Inputs
    input {
      &::-webkit-color-swatch {
        border: 0;
      }
      &::-webkit-color-swatch-wrapper {
        padding: 0;
      }
    }

    // for Code Block containing Inputs and Labels.
    .customColorInput {
      flex-wrap: wrap;

      // to make Read Only
      &.isReadOnly {
        cursor: not-allowed;

        & > input[type='text'] {
          cursor: inherit;
          filter: contrast(0);
        }

        & > input[type='color'] {
          pointer-events: none;
          cursor: inherit;
        }
      }

      &__text-input {
        max-width: calc(100% - 24px);
        flex-grow: 1;
        order: 1;
        padding: 0;
        background: transparent;
        border: 0;
        font-size: 16px;
        line-height: 1;

        &:focus {
          outline: none;
        }
      }

      .invalid-feedback {
        order: 3;
      }

      &__select-input {
        flex-shrink: 0;
        order: 2;
        width: 20px;
        height: 20px;
        padding: 0;
        border: 0;
        border-radius: 100%;
        overflow: hidden;
        cursor: pointer;
      }

      &::-webkit-color-swatch-wrapper {
        padding: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPicker),
      multi: true,
    },
  ],
})
export class ColorPicker implements ControlValueAccessor {
  value = signal('#FF7B00');
  onChange = (value: string) => {};
  onTouched = () => {};
  write = '';

  constructor() {
    effect(() => {
      if (this.value() === this.write) {
        return;
      }
      this.onChange(this.value());
      this.onTouched();
    });
  }

  writeValue(value: string): void {
    this.write = value;
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }
}
