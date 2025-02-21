import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ColorAlpha,
  ColorAlphaThumb,
  ColorHue,
  ColorHueThumb,
  ColorPickerTrigger,
  ColorSelected,
  ColorSpectrum,
  ColorSpectrumSelector,
  NgbColorInput,
  NgbColorPicker,
  registerColorPicker,
} from '@ngbase/adk/color-picker';
import { InputBase } from '@ngbase/adk/form-field';

@Component({
  selector: 'mee-color-picker-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ColorSpectrum,
    ColorSpectrumSelector,
    ColorSelected,
    ColorHue,
    ColorHueThumb,
    ColorAlpha,
    ColorAlphaThumb,
  ],
  template: `
    <div class="flex w-full flex-col">
      <div ngbColorSpectrum class="relative h-[160px] w-full overflow-hidden rounded-h">
        <button
          ngbColorSpectrumSelector
          class="pointer-events-none absolute -left-2 -top-2 h-b4 w-b4 cursor-pointer rounded-full border"
        ></button>
      </div>
      <div class="flex gap-b4 p-b3">
        <div ngbColorSelected class="aspect-square w-b10 rounded-h border bg-slate-500"></div>
        <div class="flex flex-1 flex-col gap-b4">
          <div ngbColorHue class="relative h-b3">
            <button
              ngbColorHueThumb
              class="border-red pointer-events-none absolute -top-1 h-b5 w-b5 -translate-x-2.5 cursor-pointer rounded-full border-2"
            ></button>
          </div>

          <div ngbColorAlpha class="relative h-b3">
            <button
              ngbColorAlphaThumb
              class="alpha-selector border-red pointer-events-none absolute -top-1 h-b5 w-b5 -translate-x-2.5 cursor-pointer rounded-full border-2"
            ></button>
          </div>
        </div>
      </div>
      @if (presetColors().length) {
        <div class="flex flex-wrap gap-b2 border-t p-b2 pt-b3">
          @for (color of presetColors(); track color) {
            <button
              type="button"
              class="aspect-square w-b4 rounded-h border"
              [style.backgroundColor]="color"
              (click)="setValue(color, true)"
            ></button>
          }
        </div>
      }
    </div>
  `,
  host: {
    class: 'inline-block min-w-[245px]',
  },
})
export class ColorPicker extends NgbColorPicker {}

@Component({
  selector: 'mee-color-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [registerColorPicker({ picker: ColorPicker, accessor: ColorInput })],
  imports: [ColorPickerTrigger, InputBase],
  template: `
    <input
      ngbInputBase
      type="text"
      [value]="value()"
      (valueChange)="updateValue($event)"
      class="w-full flex-1 bg-transparent outline-none"
    />
    <button
      #color
      type="button"
      ngbColorPickerTrigger
      [value]="value()"
      [format]="format()"
      [presetColors]="presetColors()"
      (valueChange)="updateValue($event)"
      class="h-b5 w-b5 flex-none rounded-full border"
      [style.backgroundColor]="value()"
    ></button>
  `,
  host: {
    class: '!inline-flex gap-2 items-center',
  },
})
export class ColorInput extends NgbColorInput {}
