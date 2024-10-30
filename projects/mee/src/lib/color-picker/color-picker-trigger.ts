import {
  Directive,
  effect,
  EffectRef,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  untracked,
} from '@angular/core';
import { ColorFormat, ColorPicker } from './color-picker';
import { popoverPortal } from '../popover';

@Directive({
  standalone: true,
  selector: '[meeColorPickerTrigger]',
  host: {
    '(click)': 'open()',
  },
})
export class ColorPickerTrigger {
  private el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private popover = popoverPortal();
  private injector = inject(Injector);

  readonly format = input<ColorFormat>('hex');
  readonly presetColors = input<string[]>();
  readonly value = model<string>();
  effectRef?: EffectRef;

  open() {
    const { diaRef, childSignal } = this.popover.open(ColorPicker, {
      target: this.el.nativeElement,
      position: 'bl',
      offset: 0,
      data: { format: this.format(), presetColors: this.presetColors() },
      width: '255px',
    });
    this.effectRef?.destroy();

    this.effectRef = effect(
      () => {
        const colorPicker = childSignal()?.instance as ColorPicker;
        if (colorPicker) {
          untracked(() => {
            colorPicker.setValue(this.value() || '#000000');
            colorPicker.valueChange.subscribe(res => {
              this.value.set(res);
            });
          });
        }
      },
      { injector: this.injector },
    );
  }
}
