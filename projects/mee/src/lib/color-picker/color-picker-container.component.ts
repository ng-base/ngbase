import {
  Component,
  ElementRef,
  afterNextRender,
  forwardRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Drag } from '../drag';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'mee-color-picker-container',
  imports: [Drag],
  template: `
    <div class="flex w-full flex-col gap-4">
      <div class="relative overflow-hidden">
        <div
          #spectrumDiv
          class="h-[160px] w-full"
          style="background-image: linear-gradient(0deg, rgb(0, 0, 0), transparent), linear-gradient(90deg, rgb(255, 255, 255), rgba(255, 255, 255, 0)); background-color: var(--hue-color);"
        ></div>
        <button
          #spectrumSelector
          class="pointer-events-none absolute -left-2 -top-2 h-4 w-4 cursor-pointer rounded-full"
        ></button>
      </div>
      <div class="flex gap-5">
        <div #selectedColor class="aspect-square w-10 bg-slate-500"></div>
        <div class="flex flex-1 flex-col gap-4">
          <div class="relative">
            <div
              #hueDiv
              class="h-[12px] w-full"
              style="inset: 0px; background: linear-gradient(to right, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0));"
            ></div>
            <button
              #hueSelector
              class="border-red pointer-events-none absolute -left-3 -top-1 h-5 w-5 cursor-pointer rounded-full border-2"
            ></button>
          </div>

          <div class="relative">
            <div
              class="h-[12px] w-full"
              style="inset: 0px; background: linear-gradient(to right, rgba(255, 0, 4, 0), var(--spectrum-color));"
            ></div>
            <button
              class="border-red pointer-events-none absolute -left-3 -top-1 h-5 w-5 cursor-pointer rounded-full border-2"
            ></button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      --hue-color: rgb(255, 0, 0);
      --spectrum-color: rgb(0, 0, 0);
    }
  `,
  host: {
    class: 'inline-block min-w-[260px]',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerContainer),
      multi: true,
    },
  ],
})
export class ColorPickerContainer implements ControlValueAccessor {
  hueDiv = viewChild<ElementRef<HTMLDivElement>>('hueDiv');
  spectrumDiv = viewChild<ElementRef<HTMLDivElement>>('spectrumDiv');
  spectrumSelector =
    viewChild<ElementRef<HTMLButtonElement>>('spectrumSelector');
  hueSelector = viewChild<ElementRef<HTMLButtonElement>>('hueSelector');
  selectedColor = viewChild<ElementRef<HTMLDivElement>>('selectedColor');
  el = inject(ElementRef);
  value = signal('#FF7B00');
  onChange = (value: string) => {};
  onTouched = () => {};
  hue = 0;
  lastSpectrumEvent?: MouseEvent;
  colorChange = output<string>();
  localValue = '';

  constructor() {
    afterNextRender(() => {
      const hueDiv = this.hueDiv()!.nativeElement;
      const spectrumDiv = this.spectrumDiv()!.nativeElement;

      // Click event for hueSelector
      hueDiv.addEventListener('mousedown', (event) => {
        this.hueEvents(event.offsetX);
        const hueMove = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
          requestAnimationFrame(() => {
            const { left, width } = hueDiv.getBoundingClientRect();
            const x = ev.clientX - left;
            if (x > 0 && x <= width) {
              this.hueEvents(x);
            }
          });
        };
        const hueUp = () => {
          document.removeEventListener('mousemove', hueMove);
          document.removeEventListener('mouseup', hueUp);
          this.colorChange.emit(this.localValue);
        };
        document.addEventListener('mousemove', hueMove);
        document.addEventListener('mouseup', hueUp);
      });

      // Click event for spectrumSelector
      spectrumDiv.addEventListener('mousedown', (event) => {
        this.spectrumEvents(event);
        const spectrumMove = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
          requestAnimationFrame(() => this.spectrumEvents(ev));
        };
        const spectrumUp = () => {
          document.removeEventListener('mousemove', spectrumMove);
          document.removeEventListener('mouseup', spectrumUp);
          this.colorChange.emit(this.localValue);
        };
        document.addEventListener('mousemove', spectrumMove);
        document.addEventListener('mouseup', spectrumUp);
      });
    });
  }

  private spectrumEvents(e: MouseEvent) {
    const spectrumRect =
      this.spectrumDiv()!.nativeElement.getBoundingClientRect();
    let x = e.clientX - spectrumRect.left;
    let y = e.clientY - spectrumRect.top;

    // Constrain x and y within the bounds of the spectrum box
    x = Math.max(0, Math.min(x, spectrumRect.width));
    y = Math.max(0, Math.min(y, spectrumRect.height));

    // Calculate the saturation and brightness based on the x and y coordinates
    const nx = (x / spectrumRect.width) * 100;
    const ny = (y / spectrumRect.height) * 100;
    const { s, l } = this.calculate(nx, ny);
    // console.log(s, l, this.hue);

    // calculate the hue offset
    const el = this.spectrumSelector()!.nativeElement;
    el.style.left = `${x - el.offsetWidth / 2}px`;
    el.style.top = `${y - el.offsetHeight / 2}px`;

    // Update the background color using the current hue, calculated saturation, and brightness
    const bg = `hsl(${this.hue}, ${s}%, ${l}%)`;
    el.style.backgroundColor = bg;
    this.el.nativeElement.style.setProperty('--spectrum-color', bg);
    this.selectedColor()!.nativeElement.style.backgroundColor = bg;
    this.lastSpectrumEvent = e;
    this.localValue = bg;
  }

  // x and y are in percentage
  calculate(x: number, y: number): { s: number; l: number } {
    const s = (x / 100) * 100;
    const l = 100 - (y / 100) * 100;
    const d = 1 + x / 100;

    return { s, l: l / d };
  }

  private hueEvents(x: number) {
    const hueRect = this.hueDiv()!.nativeElement.getBoundingClientRect();
    this.hue = (x / hueRect.width) * 360;
    this.el.nativeElement.style.setProperty(
      '--hue-color',
      `hsl(${this.hue}, 100%, 50%)`,
    );

    const el = this.hueSelector()!.nativeElement;
    const { width } = el.getBoundingClientRect();
    // update the x position of the hueSelector
    el.style.left = x - width / 2 - 2 + 'px';
    if (this.lastSpectrumEvent) this.spectrumEvents(this.lastSpectrumEvent);
  }

  rgbToHue(r: any, g: any, b: any) {
    (r /= 255), (g /= 255), (b /= 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    if (max === min) {
      h = 0; // achromatic
    } else {
      const d = max - min;
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return Math.round(h * 360);
  }

  writeValue(value: string): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
