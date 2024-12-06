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
import { popoverPortal } from '@meeui/adk/popover';
import { ColorFormat, MeeColorPicker } from './color-picker';

const ColorPicker = new InjectionToken<typeof MeeColorPicker>('ColorPicker');

export const provideColorPicker = (token: typeof MeeColorPicker) => ({
  provide: ColorPicker,
  useValue: token,
});

@Directive({
  selector: '[meeColorPickerTrigger]',
  host: {
    '(click)': 'open()',
  },
})
export class ColorPickerTrigger {
  private el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private colorPicker =
    inject<typeof MeeColorPicker>(ColorPicker, { optional: true }) ?? MeeColorPicker;
  private popover = popoverPortal();
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
        const colorPicker = childSignal()?.instance as MeeColorPicker;
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
