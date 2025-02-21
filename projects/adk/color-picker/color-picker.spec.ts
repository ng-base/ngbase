import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { firstOutputFrom, render, RenderResult } from '@ngbase/adk/test';
import { DialogRef } from '@ngbase/adk/portal';
import {
  ColorAlpha,
  ColorAlphaThumb,
  ColorFormat,
  ColorHue,
  ColorHueThumb,
  ColorSelected,
  ColorSpectrum,
  ColorSpectrumSelector,
  NgbColorPicker,
} from './color-picker';

@Component({
  selector: 'app-color-picker-container',
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
export class TestColorPicker extends NgbColorPicker {}

describe('ColorPicker', () => {
  let component: TestColorPicker;
  let view: RenderResult<TestColorPicker>;

  beforeEach(async () => {
    const dialogRefMock = { data: { format: 'hex' as ColorFormat, presetColors: [] } };
    view = await render(TestColorPicker, [{ provide: DialogRef, useValue: dialogRefMock }]);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial state', () => {
    expect(component['hue']).toBe(0);
    expect(component['saturation']).toBe(0);
    expect(component['brightness']).toBe(0);
    expect(component['alpha']).toBe(100);
    expect(component.format()).toBe('hex');
  });

  it('should set value correctly', () => {
    component.setValue('#ff0000');
    expect(component['hue']).toBe(0);
    expect(component['saturation']).toBe(100);
    expect(component['brightness']).toBe(100);
    expect(component['alpha']).toBe(100);
  });

  it('should convert colors correctly', () => {
    view.setInput('format', 'rgb');
    component.setValue('rgb(255, 0, 0)');
    expect(component['toString']()).toBe('rgb(255, 0, 0)');

    view.setInput('format', 'hsl');
    expect(component['toString']()).toBe('hsla(0, 100%, 50%, 1)');

    view.setInput('format', 'hex');
    expect(component['toString']()).toBe('#FF0000');
  });

  // it('should handle hue change', () => {
  //   jest.spyOn(component as any, 'updateHue').mockImplementation();
  //   component['handleColorEvent'](
  //     { clientX: 50, clientY: 0 } as MouseEvent,
  //     {
  //       nativeElement: {
  //         getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 10 }),
  //       },
  //     },
  //     component['updateHue'].bind(component),
  //   );
  //   expect(component['updateHue']).toHaveBeenCalledWith(50, 0, 100, 10);
  //   expect(component['hue']).toBe(180);
  // });

  // it('should handle spectrum change', () => {
  //   jest.spyOn(component as any, 'updateSpectrum').mockImplementation();
  //   component['handleColorEvent'](
  //     { clientX: 50, clientY: 50 } as MouseEvent,
  //     {
  //       nativeElement: {
  //         getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
  //       },
  //     },
  //     component['updateSpectrum'].bind(component),
  //   );
  //   expect(component['updateSpectrum']).toHaveBeenCalledWith(50, 50, 100, 100);
  //   expect(component['saturation']).toBe(50);
  //   expect(component['brightness']).toBe(50);
  // });

  // it('should handle alpha change', () => {
  //   jest.spyOn(component as any, 'updateAlpha').mockImplementation();
  //   component['handleColorEvent'](
  //     { clientX: 50, clientY: 0 } as MouseEvent,
  //     {
  //       nativeElement: {
  //         getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 10 }),
  //       },
  //     },
  //     component['updateAlpha'].bind(component),
  //   );
  //   expect(component['updateAlpha']).toHaveBeenCalledWith(50, null, 100, 10);
  //   expect(component['alpha']).toBe(50);
  // });

  it('should handle preset colors', () => {
    view.setInput('presetColors', ['#ff0000', '#00ff00', '#0000ff']);
    view.detectChanges();

    const presetButtons = view.$All('.flex.flex-wrap button');
    expect(presetButtons.length).toBe(3);

    jest.spyOn(component, 'setValue').mockImplementation();
    presetButtons[1].click();
    view.detectChanges();

    expect(component.setValue).toHaveBeenCalledWith('#00ff00', true);
  });

  it('should emit value change', async () => {
    const valuePromise = firstOutputFrom(component.valueChange);

    component.setValue('#ff0000', true);
    expect(await valuePromise).toBe('#FF0000');
  });

  it('should calculate coordinates correctly', () => {
    const el = {
      nativeElement: {
        getBoundingClientRect: () => ({ left: 10, top: 10, width: 100, height: 100 }),
      },
    };
    const event = { clientX: 60, clientY: 60 } as MouseEvent;
    const result = component['calculateCoordinates'](event, el);

    expect(result.x).toBe(50);
    expect(result.y).toBe(50);
    expect(result.rect.width).toBe(100);
    expect(result.rect.height).toBe(100);
  });

  it('should update selector positions', () => {
    component['hue'] = 180;
    component['alpha'] = 50;
    component['saturation'] = 75;
    component['brightness'] = 25;

    // Mock the necessary methods and properties
    (component as any)['hueDiv'] = signal({ el: { nativeElement: { clientWidth: 100 } } } as any);
    (component as any)['alphaDiv'] = signal({ el: { nativeElement: { clientWidth: 100 } } });
    (component as any)['spectrumDiv'] = () => ({
      el: { nativeElement: { getBoundingClientRect: () => ({ width: 100, height: 100 }) } },
    });
    (component as any)['hueSelector'] = signal({ nativeElement: { style: {} } });
    (component as any)['alphaSelector'] = signal({ nativeElement: { style: {} } });
    (component as any)['spectrumSelector'] = signal({ nativeElement: { style: {} } });

    component['updateSelectorPositions']();

    expect(component['hueSelector']().nativeElement.style.left).toBe('50px');
    expect(component['alphaSelector']().nativeElement.style.left).toBe('50px');
    expect(component['spectrumSelector']().nativeElement.style.left).toBe('67px');
    expect(component['spectrumSelector']().nativeElement.style.top).toBe('67px');
  });
});
