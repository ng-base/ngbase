import {
  Directive,
  effect,
  EffectRef,
  ElementRef,
  inject,
  InjectionToken,
  Injector,
  input,
  model,
  untracked,
} from '@angular/core';
import { ngbPopoverPortal } from '@ngbase/adk/popover';
import { provideValueAccessor } from '@ngbase/adk/utils';
import { NgbColorInput } from './color-input';
import { ColorFormat, NgbColorPicker } from './color-picker';

const ColorPicker = new InjectionToken<typeof NgbColorPicker>('ColorPicker');

interface ColorPickerOptions {
  picker: typeof NgbColorPicker;
  accessor: typeof NgbColorInput;
}

export const registerColorPicker = ({ picker, accessor }: ColorPickerOptions) => [
  { provide: ColorPicker, useValue: picker },
  provideValueAccessor(accessor),
];

@Directive({
  selector: '[ngbColorPickerTrigger]',
  host: {
    '(click)': 'open()',
  },
})
export class ColorPickerTrigger {
  private el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private colorPicker =
    inject<typeof NgbColorPicker>(ColorPicker, { optional: true }) ?? NgbColorPicker;
  private popover = ngbPopoverPortal();
  private injector = inject(Injector);

  readonly format = input<ColorFormat>('hex');
  readonly presetColors = input<string[]>();
  readonly value = model<string>();
  effectRef?: EffectRef;

  open() {
    const { childSignal } = this.popover.open(this.colorPicker, {
      target: this.el.nativeElement,
      position: 'bl',
      offset: 0,
      data: { format: this.format(), presetColors: this.presetColors() },
      width: '255px',
    });
    this.effectRef?.destroy();

    this.effectRef = effect(
      () => {
        const colorPicker = childSignal()?.instance as NgbColorPicker;
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
