import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPicker, ColorFormat } from './color-picker.component';
import { By } from '@angular/platform-browser';
import { DialogRef } from '../portal';
import { signal } from '@angular/core';

describe('ColorPicker', () => {
  let component: ColorPicker;
  let fixture: ComponentFixture<ColorPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPicker],
      providers: [
        {
          provide: DialogRef,
          useValue: { data: { format: 'hex' as ColorFormat, presetColors: [] } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    fixture.componentRef.setInput('format', 'rgb');
    component.setValue('rgb(255, 0, 0)');
    expect(component.toString()).toBe('rgb(255, 0, 0)');

    fixture.componentRef.setInput('format', 'hsl');
    expect(component.toString()).toBe('hsla(0, 100%, 50%, 1)');

    fixture.componentRef.setInput('format', 'hex');
    expect(component.toString()).toBe('#FF0000');
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
    fixture.componentRef.setInput('presetColors', ['#ff0000', '#00ff00', '#0000ff']);
    fixture.detectChanges();

    const presetButtons = fixture.debugElement.queryAll(By.css('.flex.flex-wrap button'));
    expect(presetButtons.length).toBe(3);

    jest.spyOn(component, 'setValue').mockImplementation();
    presetButtons[1].nativeElement.click();
    fixture.detectChanges();

    expect(component.setValue).toHaveBeenCalledWith('#00ff00', true);
  });

  it('should emit value change', done => {
    component.valueChange.subscribe(value => {
      expect(value).toBe('#FF0000');
      done();
    });

    component.setValue('#ff0000', true);
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
