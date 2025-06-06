import { signal } from '@angular/core';
import { ColorFormat } from '@ngbase/adk/color-picker';
import { DialogRef } from '@ngbase/adk/portal';
import { firstOutputFrom, render, RenderResult } from '@ngbase/adk/test';
import { ColorPicker } from './color-picker';

describe('ColorPicker', () => {
  let component: ColorPicker;
  let view: RenderResult<ColorPicker>;

  beforeEach(async () => {
    const dialogRefMock = { data: { format: 'hex' as ColorFormat, presetColors: [] } };
    view = await render(ColorPicker, [{ provide: DialogRef, useValue: dialogRefMock }]);
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
