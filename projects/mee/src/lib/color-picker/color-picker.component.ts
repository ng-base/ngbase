import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Drag } from '../drag';
import {
  hexToHsb,
  hsbToHex,
  hsbToHsl,
  hsbToRgb,
  hslToHex,
  hslToHsb,
  parseHsb,
  parseRgb,
  rgbToHsb,
} from './utils';
import { DialogRef } from '../portal';

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsb';
@Component({
  standalone: true,
  selector: 'mee-color-picker-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Drag],
  template: `
    <div class="flex w-full flex-col gap-b">
      <div class="relative overflow-hidden">
        <div
          #spectrumDiv
          class="rounded-h h-[160px] w-full"
          style="background-image: linear-gradient(0deg, rgb(0, 0, 0), transparent), linear-gradient(90deg, rgb(255, 255, 255), rgba(255, 255, 255, 0)); background-color: var(--hue-color);"
        ></div>
        <button
          #spectrumSelector
          class="pointer-events-none absolute -left-2 -top-2 h-b4 w-b4 cursor-pointer rounded-full border"
        ></button>
      </div>
      <div class="flex gap-b4 p-b2">
        <div #selectedColor class="rounded-h aspect-square w-b10 border bg-slate-500"></div>
        <div class="flex flex-1 flex-col gap-b4">
          <div class="relative">
            <div
              #hueDiv
              class="h-[12px] w-full"
              style="inset: 0px; background: linear-gradient(to right, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0));"
            ></div>
            <button
              #hueSelector
              class="border-red pointer-events-none absolute -left-3 -top-1 h-b5 w-b5 cursor-pointer rounded-full border-2"
            ></button>
          </div>

          <div class="alpha-container relative">
            <div
              class="h-[12px] w-full"
              style="inset: 0px; background: linear-gradient(to right, rgba(255, 0, 4, 0), var(--spectrum-color));"
            ></div>
            <button
              class="border-red pointer-events-none absolute -left-3 -top-1 h-b5 w-b5 cursor-pointer rounded-full border-2"
            ></button>
          </div>
        </div>
      </div>
      @if (presetColors().length) {
        <div class="flex flex-wrap gap-2 border-t p-b2 pt-b3">
          @for (color of presetColors(); track color) {
            <button
              class="rounded-h aspect-square w-b4 border"
              [style.backgroundColor]="color"
              (click)="setValue(color, true)"
            ></button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      --hue-color: rgb(255, 0, 0);
      --spectrum-color: rgb(0, 0, 0);
    }
    .alpha-container {
      background-image: conic-gradient(
        rgba(0, 0, 0, 0.06) 0 25%,
        transparent 0 50%,
        rgba(0, 0, 0, 0.06) 0 75%,
        transparent 0
      );
      background-size: 8px 8px;
    }
  `,
  host: {
    class: 'inline-block min-w-[245px]',
  },
})
export class ColorPicker {
  private readonly el = inject(ElementRef);
  private readonly dialogRef = inject(DialogRef, { optional: true });
  readonly hueDiv = viewChild<ElementRef<HTMLDivElement>>('hueDiv');
  readonly spectrumDiv = viewChild<ElementRef<HTMLDivElement>>('spectrumDiv');
  readonly spectrumSelector = viewChild<ElementRef<HTMLButtonElement>>('spectrumSelector');
  readonly hueSelector = viewChild<ElementRef<HTMLButtonElement>>('hueSelector');
  readonly selectedColor = viewChild<ElementRef<HTMLDivElement>>('selectedColor');
  readonly valueChange = output<string>();
  readonly format = input<ColorFormat>(this.dialogRef?.data.format || 'hex');
  readonly presetColors = input<string[]>(this.dialogRef?.data.presetColors || []);
  private hue = 0;
  private saturation = 0;
  private brightness = 0;
  private lastSpectrumEvent?: MouseEvent;
  private localValue = '';

  constructor() {
    console.log(this.format());
    afterNextRender(() => {
      const hueDiv = this.hueDiv()!.nativeElement;
      const spectrumDiv = this.spectrumDiv()!.nativeElement;

      // Click event for hueSelector
      hueDiv.addEventListener('mousedown', event => {
        this.hueEvents(event.offsetX);
        const hueMove = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
          requestAnimationFrame(() => {
            const { left, width } = hueDiv.getBoundingClientRect();
            const x = Math.round(ev.clientX - left);
            if (x > 0 && x <= width) {
              this.hueEvents(x);
            }
          });
        };
        const hueUp = () => {
          document.removeEventListener('mousemove', hueMove);
          document.removeEventListener('mouseup', hueUp);
          this.updateValue();
          this.valueChange.emit(this.localValue);
        };
        document.addEventListener('mousemove', hueMove);
        document.addEventListener('mouseup', hueUp);
      });

      // Click event for spectrumSelector
      spectrumDiv.addEventListener('mousedown', event => {
        this.spectrumEvents(event);
        const spectrumMove = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
          requestAnimationFrame(() => this.spectrumEvents(ev));
        };
        const spectrumUp = () => {
          document.removeEventListener('mousemove', spectrumMove);
          document.removeEventListener('mouseup', spectrumUp);
          this.valueChange.emit(this.localValue);
        };
        document.addEventListener('mousemove', spectrumMove);
        document.addEventListener('mouseup', spectrumUp);
      });
    });
  }

  private spectrumEvents(e: MouseEvent) {
    const spectrumRect = this.spectrumDiv()!.nativeElement.getBoundingClientRect();

    let x = Math.round(e.clientX - spectrumRect.left);
    let y = Math.round(e.clientY - spectrumRect.top);

    // Constrain x and y within the bounds of the spectrum box
    x = Math.max(0, Math.min(x, spectrumRect.width));
    y = Math.max(0, Math.min(y, spectrumRect.height));

    // Calculate the saturation and brightness based on the x and y coordinates
    const { s, b } = this.calculateSaturationAndLuminous(
      x,
      y,
      spectrumRect.width,
      spectrumRect.height,
    );
    this.saturation = s;
    this.brightness = b;
    // console.log(s, l, this.hue);

    // calculate the hue offset
    const el = this.spectrumSelector()!.nativeElement;
    el.style.left = `${x - el.offsetWidth / 2}px`;
    el.style.top = `${y - el.offsetHeight / 2}px`;

    this.lastSpectrumEvent = e;
    this.updateValue();
  }

  private hueEvents(x: number) {
    const hueRect = this.hueDiv()!.nativeElement.getBoundingClientRect();
    this.hue = Math.round((x / hueRect.width) * 360);
    this.el.nativeElement.style.setProperty('--hue-color', `hsl(${this.hue}, 100%, 50%)`);

    const el = this.hueSelector()!.nativeElement;
    const { width } = el.getBoundingClientRect();
    // update the x position of the hueSelector
    el.style.left = x - width / 2 - 2 + 'px';
    if (this.lastSpectrumEvent) this.spectrumEvents(this.lastSpectrumEvent);
    this.updateValue();
  }

  setValue(value: string, emit = false): void {
    if (!value) return;
    this.parse(value);
    this.updateValue(emit);
    this.el.nativeElement.style.setProperty('--hue-color', this.getColor(this.hue, 100, 100));
    this.updateHueSelectorPosition();
    this.updateSpectrumSelectorPosition();
  }

  private updateSpectrumSelectorPosition() {
    const spectrumRect = this.spectrumDiv()!.nativeElement.getBoundingClientRect();
    const spectrumSelector = this.spectrumSelector()!.nativeElement;
    const { x, y } = this.calculateSpectrumPosition(
      this.saturation,
      this.brightness,
      spectrumRect.width,
      spectrumRect.height,
    );
    spectrumSelector.style.left = `${x}px`;
    spectrumSelector.style.top = `${y}px`;
  }

  private updateHueSelectorPosition() {
    const hueRect = this.hueDiv()!.nativeElement.getBoundingClientRect();
    const el = this.hueSelector()!.nativeElement;
    const { width } = el.getBoundingClientRect();
    el.style.left = (this.hue / 360) * hueRect.width - width / 2 - 2 + 'px';
  }

  // Simplified function to calculate the x and y based on the saturation and lightness
  calculateSpectrumPosition(
    s: number,
    l: number,
    spectrumWidth: number,
    spectrumHeight: number,
  ): { x: number; y: number } {
    const handlerSize = 16;
    const half = handlerSize / 2;
    const x = (spectrumWidth * s) / 100 - half;
    const y = (spectrumHeight * (100 - l)) / 100 - half;
    return { x, y };
  }

  calculateSaturationAndLuminous(
    x: number,
    y: number,
    sw: number,
    sh: number,
  ): { s: number; b: number } {
    const s = Math.round((x / sw) * 100);
    const b = Math.round(100 - (y / sh) * 100);
    return { s, b };
  }

  // it is a hsb color
  getColor(h: number, s: number, b: number) {
    const [hh, ss, l] = hsbToHsl(h, s, b);
    return `hsl(${hh}, ${ss}%, ${l}%)`;
  }

  updateValue(emit = false) {
    this.localValue = this.toString();
    const hsl = this.getColor(this.hue, this.saturation, this.brightness);
    this.el.nativeElement.style.setProperty('--spectrum-color', hsl);
    this.selectedColor()!.nativeElement.style.backgroundColor = hsl;
    this.spectrumSelector()!.nativeElement.style.backgroundColor = hsl;
    if (emit) this.valueChange.emit(this.localValue);
  }

  toString() {
    switch (this.format()) {
      case 'hsb':
        return `hsb(${this.hue}, ${this.saturation}%, ${this.brightness}%)`;
      case 'hex':
        return hsbToHex(this.hue, this.saturation, this.brightness);
      case 'rgb': {
        const [r, g, b] = hsbToRgb(this.hue, this.saturation, this.brightness);
        return `rgb(${r}, ${g}, ${b})`;
      }
      case 'hsl': {
        const [h, s, l] = hsbToHsl(this.hue, this.saturation, this.brightness);
        return `hsl(${h}, ${s}%, ${l}%)`;
      }
      default:
        return '';
    }
  }

  parse(value: string) {
    let hsb = [0, 0, 0];
    switch (this.format()) {
      case 'hsb':
        hsb = parseHsb(value);
        break;
      case 'hex':
        hsb = hexToHsb(value);
        break;
      case 'rgb':
        hsb = rgbToHsb(...parseRgb(value));
        break;
      case 'hsl':
        hsb = hslToHsb(...parseHsb(value));
        break;
    }
    this.hue = hsb[0];
    this.saturation = hsb[1];
    this.brightness = hsb[2];
  }
}
