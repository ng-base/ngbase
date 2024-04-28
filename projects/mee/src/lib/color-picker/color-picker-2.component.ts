import {
  Component,
  afterNextRender,
  viewChild,
  ElementRef,
} from '@angular/core';
import { DragDirective } from '../drag';

@Component({
  standalone: true,
  selector: 'mee-color-picker-2',
  imports: [DragDirective],
  template: `
    <div class="flex w-full flex-col gap-4">
      <div class="relative overflow-hidden">
        <canvas
          #spectrumCanvas
          width="360"
          height="360"
          willReadFrequently
        ></canvas>
        <button
          #spectrumSelector
          class="border-red pointer-events-none absolute -left-2 -top-2 h-4 w-4 cursor-pointer rounded-full border-2"
        ></button>
      </div>
      <div class="relative">
        <canvas #hueCanvas width="360" height="12"></canvas>
        <button
          #hueSelector
          class="border-red pointer-events-none absolute -left-3 -top-1 h-5 w-5 cursor-pointer rounded-full border-2"
        ></button>
      </div>
    </div>
  `,
  styles: ``,
  host: {
    class: 'inline-block min-w-[360px]',
  },
})
export class ColorPicker2 {
  hueCanvas = viewChild<ElementRef<HTMLCanvasElement>>('hueCanvas');
  spectrumCanvas = viewChild<ElementRef<HTMLCanvasElement>>('spectrumCanvas');
  spectrumSelector =
    viewChild<ElementRef<HTMLButtonElement>>('spectrumSelector');
  hueSelector = viewChild<ElementRef<HTMLButtonElement>>('hueSelector');
  hue = 0;

  constructor() {
    afterNextRender(() => {
      const hueCanvas = this.hueCanvas()!.nativeElement;
      const ctxHue = hueCanvas.getContext('2d')!;
      const spectrumCanvas = this.spectrumCanvas()!.nativeElement;
      const ctxSpectrum = spectrumCanvas.getContext('2d')!;

      // Create hue gradient for hueSelector
      let hueGradient = ctxHue.createLinearGradient(0, 0, hueCanvas.width, 0);
      for (let i = 0; i <= 360; i += 10) {
        hueGradient.addColorStop(i / 360, 'hsl(' + i + ', 100%, 50%)');
      }
      ctxHue.fillStyle = hueGradient;
      ctxHue.fillRect(0, 0, hueCanvas.width, hueCanvas.height);

      // Initial spectrum
      this.updateSpectrum(ctxSpectrum, spectrumCanvas, 0);

      // Click event for hueSelector
      hueCanvas.addEventListener('mousedown', (event) => {
        this.hueEvents(event, ctxHue, ctxSpectrum, spectrumCanvas);
        const hueMove = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
          requestAnimationFrame(() =>
            this.hueEvents(ev, ctxHue, ctxSpectrum, spectrumCanvas),
          );
        };
        const hueUp = () => {
          hueCanvas.removeEventListener('mousemove', hueMove);
          document.removeEventListener('mouseup', hueUp);
        };
        hueCanvas.addEventListener('mousemove', hueMove);
        document.addEventListener('mouseup', hueUp);
      });

      // Click event for spectrumSelector
      spectrumCanvas.addEventListener('mousedown', (event) => {
        this.spectrumEvents(event, ctxSpectrum);
        const spectrumMove = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
          requestAnimationFrame(() => this.spectrumEvents(ev, ctxSpectrum));
        };
        const spectrumUp = () => {
          document.removeEventListener('mousemove', spectrumMove);
          document.removeEventListener('mouseup', spectrumUp);
        };
        document.addEventListener('mousemove', spectrumMove);
        document.addEventListener('mouseup', spectrumUp);
      });
    });
  }

  private spectrumEvents(e: MouseEvent, ctxSpectrum: CanvasRenderingContext2D) {
    // const x = event.offsetX;
    // const y = event.offsetY;
    const spectrumRect =
      this.spectrumCanvas()!.nativeElement.getBoundingClientRect();
    let x = e.clientX - spectrumRect.left;
    let y = e.clientY - spectrumRect.top;
    //constrain x max
    if (x > spectrumRect.width) {
      x = spectrumRect.width;
    }
    if (x < 0) {
      x = 0.1;
    }
    if (y > spectrumRect.height) {
      y = spectrumRect.height;
    }
    if (y < 0) {
      y = 0.1;
    }
    console.log('x', x, 'y', y);
    const spectrumData = ctxSpectrum.getImageData(x, y, 1, 1).data;
    // const hue = this.rgbToHue(
    //   spectrumData[0],
    //   spectrumData[1],
    //   spectrumData[2],
    // );
    // console.log('hue', hue);
    const el = this.spectrumSelector()!.nativeElement;
    const { width, height } = el.getBoundingClientRect();
    el.style.backgroundColor = `rgb(${spectrumData[0]}, ${spectrumData[1]}, ${spectrumData[2]}, ${spectrumData[3] / 255})`;

    // update the x position of the spectrumSelector
    el.style.left = x - width / 2 - 2 + 'px';
    el.style.top = y - height / 2 - 2 + 'px';
  }

  private hueEvents(
    event: MouseEvent,
    ctxHue: CanvasRenderingContext2D,
    ctxSpectrum: CanvasRenderingContext2D,
    sCanvas: HTMLCanvasElement,
  ) {
    const x = event.offsetX;
    const hueData = ctxHue.getImageData(x, 0, 1, 1).data;
    const hue = this.rgbToHue(hueData[0], hueData[1], hueData[2]);
    const el = this.hueSelector()!.nativeElement;
    const { width } = el.getBoundingClientRect();
    el.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

    // update the x position of the hueSelector
    el.style.left = x - width / 2 - 2 + 'px';

    this.updateSpectrum(ctxSpectrum, sCanvas, hue);
  }

  updateSpectrum(
    ctx: CanvasRenderingContext2D,
    sCanvas: HTMLCanvasElement,
    hue: number,
  ) {
    this.hue = hue;
    console.log('hue', hue);
    // Clear the canvas first
    ctx.clearRect(0, 0, sCanvas.width, sCanvas.height);

    // Base color layer with selected hue, full saturation, and medium brightness
    const baseColor = `hsl(${hue}, 100%, 50%)`;
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, sCanvas.width, sCanvas.height);

    // Create and apply a horizontal white gradient to decrease saturation from left to right
    let whiteGradient = ctx.createLinearGradient(0, 0, sCanvas.width, 0);
    whiteGradient.addColorStop(0, '#fff');
    whiteGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = whiteGradient;
    ctx.fillRect(0, 0, sCanvas.width, sCanvas.height);

    // Create and apply a vertical black gradient to decrease brightness from top to bottom
    let blackGradient = ctx.createLinearGradient(0, 0, 0, sCanvas.height);
    blackGradient.addColorStop(0, 'transparent');
    blackGradient.addColorStop(1, '#000');
    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, sCanvas.width, sCanvas.height);
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
}
