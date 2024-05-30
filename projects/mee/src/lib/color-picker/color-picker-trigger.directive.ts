import { Directive, ElementRef, inject, input, output } from '@angular/core';
import { ColorPickerContainer } from './color-picker-container.component';
import { NgControl } from '@angular/forms';
import { popoverPortal } from '../popover';

@Directive({
  standalone: true,
  selector: '[meeColorPickerTrigger]',
  host: {
    '(click)': 'open()',
  },
})
export class ColorPickerTrigger {
  // meeColorPickerTrigger = input.required<ColorPickerContainer>();
  control = inject(NgControl, { optional: true, self: true });
  el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  popover = popoverPortal();
  colorChanged = output<string>();

  constructor() {
    // if (this.control) {
    //   const colorPicker = this.meeColorPickerTrigger();
    //   this.control.valueAccessor = {
    //     writeValue: (value: string) => {
    //       colorPicker.writeValue(value);
    //     },
    //     registerOnChange: (fn: (value: string) => void) => {
    //       colorPicker.registerOnChange(fn);
    //     },
    //     registerOnTouched: (fn: () => void) => {
    //       colorPicker.registerOnTouched(fn);
    //     },
    //     // setDisabledState: (isDisabled: boolean) => {
    //     //   colorPicker.setDisabledState(isDisabled);
    //     // },
    //   };
    // }
  }

  open() {
    const ref = this.popover.open(ColorPickerContainer, {
      target: this.el.nativeElement,
      position: 'bl',
      offset: 0,
    });
  }
}
