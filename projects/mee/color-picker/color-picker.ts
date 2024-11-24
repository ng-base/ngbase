import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Drag } from '@meeui/adk/drag';
import { DialogRef } from '@meeui/adk/portal';
import {
  hexToHsb,
  hsbaToHex,
  hsbaToRgba,
  hsbToHsl,
  hslaToHsba,
  parseHsba,
  parseRgba,
  rgbToHsba,
} from './utils';

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsb';
@Component({
  selector: 'mee-color-picker-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Drag],
  template: `
    <div class="flex w-full flex-col">
      <div class="relative overflow-hidden">
        <div
          meeDrag
          #spectrumDiv="meeDrag"
          class="h-[160px] w-full rounded-h"
          style="background-image: linear-gradient(0deg, rgb(0, 0, 0), transparent), linear-gradient(90deg, rgb(255, 255, 255), rgba(255, 255, 255, 0)); background-color: var(--hue-color);"
        ></div>
        <button
          #spectrumSelector
          type="button"
          class="pointer-events-none absolute -left-2 -top-2 h-b4 w-b4 cursor-pointer rounded-full border"
        ></button>
      </div>
      <div class="flex gap-b4 p-b3">
        <div #selectedColor class="aspect-square w-b10 rounded-h border bg-slate-500"></div>
        <div class="flex flex-1 flex-col gap-b4">
          <div class="relative">
            <div
              meeDrag
              #hueDiv="meeDrag"
              class="hue-div h-b3 w-full"
              style="inset: 0px; background: linear-gradient(to right, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0));"
            ></div>
            <button
              #hueSelector
              type="button"
              class="border-red pointer-events-none absolute -top-1 h-b5 w-b5 -translate-x-2.5 cursor-pointer rounded-full border-2"
            ></button>
          </div>

          <div class="alpha-container relative">
            <div
              meeDrag
              #alphaDiv="meeDrag"
              class="alpha-div h-b3 w-full"
              style="inset: 0px; background: linear-gradient(to right, rgba(255, 0, 4, 0), var(--spectrum-color));"
            ></div>
            <button
              #alphaSelector
              type="button"
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
  readonly hueDiv = viewChild.required<Drag>('hueDiv');
  readonly hueSelector = viewChild.required<ElementRef<HTMLButtonElement>>('hueSelector');

  readonly spectrumDiv = viewChild.required<Drag>('spectrumDiv');
  readonly spectrumSelector = viewChild.required<ElementRef<HTMLButtonElement>>('spectrumSelector');

  readonly selectedColor = viewChild<ElementRef<HTMLDivElement>>('selectedColor');

  private alpha = 100; // 0-100
  readonly alphaDiv = viewChild.required<Drag>('alphaDiv');
  readonly alphaSelector = viewChild.required<ElementRef<HTMLButtonElement>>('alphaSelector');

  readonly valueChange = output<string>();
  readonly format = input<ColorFormat>(this.dialogRef?.data.format || 'hex');
  readonly presetColors = input<string[]>(this.dialogRef?.data.presetColors || []);
  private hue = 0;
  private saturation = 0;
  private brightness = 0;
  private lastSpectrumEvent?: MouseEvent;
  private localValue = '';

  private colorParsers = new Map<ColorFormat, (value: string) => [number, number, number, number]>([
    ['hsb', parseHsba],
    ['hex', hexToHsb],
    ['rgb', (value: string) => rgbToHsba(...parseRgba(value))],
    ['hsl', (value: string) => hslaToHsba(...parseHsba(value))],
  ]);

  constructor() {
    afterNextRender(() => {
      this.setupEventListeners();
    });
  }

  private calculateCoordinates(e: MouseEvent, el: ElementRef) {
    const rect = el.nativeElement.getBoundingClientRect();

    let x = Math.round(e.clientX - rect.left);
    let y = Math.round(e.clientY - rect.top);

    // Constrain x and y within the bounds of the spectrum box
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    return { x, y, rect };
  }

  private setupEventListeners() {
    this.setupDragListener(this.hueDiv(), (x, y, w, h) => this.updateHue(x, 0, w, h));
    this.setupDragListener(this.spectrumDiv(), this.updateSpectrum.bind(this));
    this.setupDragListener(this.alphaDiv(), (x, y, w) => this.updateAlpha(x, 0, w));
  }

  private setupDragListener(
    dragElement: Drag,
    updateFunction: (x: number, y: number, width: number, height: number) => void,
  ) {
    dragElement.events.subscribe(event => {
      if (event.type === 'start' || event.type === 'move') {
        this.handleColorEvent(event.event! as PointerEvent, dragElement.el, updateFunction);
        // If we want to avoid emitting the value on every move,
        // we can add a flag to emit only when the event is 'end'
        this.valueChange.emit(this.localValue);
      }
    });
  }

  private handleColorEvent(
    event: PointerEvent,
    element: ElementRef,
    updateFunction: (x: number, y: number, width: number, height: number) => void,
  ) {
    const { x, y, rect } = this.calculateCoordinates(event, element);
    updateFunction(x, y, rect.width, rect.height);
    this.updateValue();
  }

  private updateHue(x: number, y: number, width: number, height: number) {
    console.log('updateHue', x, y, width, height);
    this.hue = Math.round((x / width) * 360);
    this.el.nativeElement.style.setProperty('--hue-color', `hsl(${this.hue}, 100%, 50%)`);
    const hueSelector = this.hueSelector()!.nativeElement;
    hueSelector.style.left = `${x}px`;
    if (this.lastSpectrumEvent) this.updateValue();
  }

  private updateSpectrum(x: number, y: number, width: number, height: number) {
    const { s, b } = this.calculateSaturationAndLuminous(x, y!, width, height);
    this.saturation = s;
    this.brightness = b;
    this.lastSpectrumEvent = { clientX: x, clientY: y } as PointerEvent;
    const spectrumSelector = this.spectrumSelector()!.nativeElement;
    spectrumSelector.style.left = `${x - spectrumSelector.offsetWidth / 2}px`;
    spectrumSelector.style.top = `${y! - spectrumSelector.offsetHeight / 2}px`;
  }

  private updateAlpha(x: number, y: number, width: number) {
    this.alpha = Math.round((x / width) * 100);
    const alphaSelector = this.alphaSelector()!.nativeElement;
    alphaSelector.style.left = `${x}px`;
  }

  setValue(value: string, emit = false): void {
    if (!value) return;
    this.parse(value);
    this.updateValue(emit);
    this.el.nativeElement.style.setProperty('--hue-color', this.getColor(this.hue, 100, 100, 100));
    this.updateSelectorPositions();
  }

  private updateSelectorPositions() {
    this.updateSelectorPosition(this.hueDiv().el, this.hueSelector(), this.hue / 360);
    this.updateSelectorPosition(this.alphaDiv().el, this.alphaSelector(), this.alpha / 100);
    this.updateSpectrumSelectorPosition();
  }

  private updateSelectorPosition(
    containerEl: ElementRef<HTMLElement>,
    selectorEl: ElementRef<HTMLButtonElement>,
    ratio: number,
  ) {
    selectorEl.nativeElement.style.left = ratio * containerEl.nativeElement.clientWidth + 'px';
  }

  private updateSpectrumSelectorPosition() {
    const spectrumRect = this.spectrumDiv().el.nativeElement.getBoundingClientRect();
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

  updateValue(emit = false) {
    this.localValue = this.toString();
    const hsla = this.getColor(this.hue, this.saturation, this.brightness, this.alpha);
    this.el.nativeElement.style.setProperty('--spectrum-color', hsla);
    this.selectedColor()!.nativeElement.style.backgroundColor = hsla;
    this.spectrumSelector()!.nativeElement.style.backgroundColor = hsla;
    if (emit) this.valueChange.emit(this.localValue);
  }

  getColor(h: number, s: number, b: number, a: number) {
    const [hh, ss, l] = hsbToHsl(h, s, b);
    return `hsla(${hh}, ${ss}%, ${l}%, ${a / 100})`;
  }

  parse(value: string) {
    const parser = this.colorParsers.get(this.format());
    if (parser) {
      [this.hue, this.saturation, this.brightness, this.alpha] = parser(value);
      this.alpha = Math.round(this.alpha * 100);
    }
  }

  toString() {
    const alpha = this.alpha / 100;
    const formatters = {
      hsb: () => `hsba(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${alpha})`,
      hex: () => hsbaToHex(this.hue, this.saturation, this.brightness, alpha),
      rgb: () => {
        const [r, g, b, a] = hsbaToRgba(this.hue, this.saturation, this.brightness, alpha);
        return a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
      },
      hsl: () => {
        const [h, s, l] = hsbToHsl(this.hue, this.saturation, this.brightness);
        return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
      },
    };
    return formatters[this.format()]?.() || '';
  }
}
