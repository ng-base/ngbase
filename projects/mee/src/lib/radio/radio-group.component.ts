import {
  Component,
  afterNextRender,
  contentChildren,
  effect,
  forwardRef,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Radio } from './radio.component';
import { generateId } from '../utils';

@Component({
  standalone: true,
  selector: 'mee-radio-group',
  imports: [FormsModule],
  template: `<ng-content></ng-content>`,
  host: {
    class: 'flex gap-b2',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroup),
      multi: true,
    },
  ],
})
export class RadioGroup implements ControlValueAccessor {
  radios = contentChildren(Radio, { descendants: true });
  value = model<any>('');
  name = generateId();
  onChange = (value: any) => {};
  onTouched = () => {};

  constructor() {
    effect(
      () => {
        const radios = this.radios();
        radios.forEach(radio => {
          radio.name = this.name;
          radio.updateValue = ev => {
            this.updateValue(radio.value());
          };
        });
      },
      { allowSignalWrites: true },
    );
  }

  updateValue(value: any) {
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
