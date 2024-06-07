import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { Heading } from '@meeui/typography';
import { Input } from '@meeui/input';
import {
  ColorPicker,
  ColorPickerContainer,
  ColorPickerTrigger,
} from '@meeui/color-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-colors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    Heading,
    Input,
    JsonPipe,
    ColorPickerContainer,
    ColorPickerTrigger,
  ],
  template: `
    <h4 meeHeader="md" class="mb-4">Colors</h4>
    <div class="inline-flex flex-col gap-2">
      <h4>Color code</h4>
      <div class="flex">
        <input meeInput placeholder="Color code" [(ngModel)]="color" />
        <button meeInput meeColorPickerTrigger>asdf</button>
      </div>
    </div>

    <div class="mt-4 flex gap-4">
      <div class="flex flex-col gap-2">
        <label>Red</label>
        <input
          meeInput
          type="text"
          min="0"
          max="255"
          [ngModel]="rgb().r"
          readOnly
        />
      </div>
      <div class="flex flex-col gap-2">
        <label>Green</label>
        <input
          meeInput
          type="text"
          min="0"
          max="255"
          [ngModel]="rgb().g"
          readOnly
        />
      </div>
      <div class="flex flex-col gap-2">
        <label>Blue</label>
        <input
          meeInput
          type="text"
          min="0"
          max="255"
          [ngModel]="rgb().b"
          readOnly
        />
      </div>
    </div>
    <div class="mt-4 flex flex-col gap-2">
      <label>CSS Color</label>
      <input
        meeInput
        type="text"
        min="0"
        max="255"
        [ngModel]="cssColor()"
        readOnly
      />
      <input meeInput type="text" [ngModel]="hex()" readOnly />
    </div>
    <div class="mt-4 flex flex-col gap-2">
      <label>Color preview</label>
      <div
        class="h-36 rounded-md border "
        [style.backgroundColor]="cssColor()"
      ></div>
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class ColorsComponent implements OnInit {
  color = signal('');
  hex = computed(() => {
    const color = this.color();
    return this.isHex(color) ? color : this.rgbToHex(color);
  });
  rgb = computed(() => {
    const color = this.hex();
    const rgb = this.hexToRgb(color);
    return rgb || { r: '', g: '', b: '' };
  });

  cssColor = computed(() => {
    const { r, g, b } = this.rgb();
    return r !== '' ? `rgb(${r}, ${g}, ${b})` : '';
  });

  constructor() {}

  ngOnInit() {}

  rgbToHex(color: string) {
    const rgb = color
      .substring(4, color.length - 1)
      .split(', ')
      .reduce((a, x) => {
        if (x === '') {
          return a;
        }
        a.push(parseInt(x));
        return a;
      }, [] as number[]);
    return rgb.length
      ? `#${rgb
          .map((x) => x.toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase()}`
      : '';
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

  // colorRGB(color: string): string {
  //   if (this.isHex(color)) {
  //     color = this.hexToRgb(color);
  //   }
  //   const rgb = this.rgbToVariable(color);
  //   return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  // }

  isHex(hex: string) {
    return /^#[0-9A-F]{6}$/i.test(hex);
  }

  // hexToRgb(hex: string): string {
  //   const rgb = hex
  //     .replace(
  //       /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
  //       (m, r, g, b) => r + r + g + g + b + b,
  //     )
  //     .substring(1)
  //     .match(/.{2}/g)
  //     ?.map((x) => parseInt(x, 16));
  //   return rgb ? `rgb(${rgb.join(', ')})` : '';
  // }

  // rgbToHex(r: number, g: number, b: number) {
  //   return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  // }

  // rgbToVariable(rgb: string): { r: number; g: number; b: number } {
  //   const [r, g, b] = rgb
  //     .substring(4, rgb.length - 1)
  //     .split(', ')
  //     .map((x) => parseInt(x));
  //   return { r, g, b };
  // }
}
