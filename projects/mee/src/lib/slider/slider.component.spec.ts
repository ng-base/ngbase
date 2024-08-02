import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Slider } from './slider.component';
import { DragData } from '../drag';

describe('Slider', () => {
  let component: Slider;
  let fixture: ComponentFixture<Slider>;

  function mockDrag(type: 'start' | 'move' | 'end', x: number, clientX: number) {
    const dragEvent = {
      type,
      x,
      clientX,
      event: new MouseEvent('mousemove'),
    } as DragData;
    component['moveSlider'](dragEvent);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Slider],
    }).compileComponents();

    fixture = TestBed.createComponent(Slider);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Mock the element
    component['el'].nativeElement = {
      clientWidth: 100,
      getBoundingClientRect: () => ({ left: 0 }),
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.step()).toBe(1);
    expect(component.min()).toBe(0);
    expect(component.max()).toBe(100);
    expect(component.range()).toBe(false);
    expect(component.immediateUpdate()).toBe(true);
  });

  it('should set the form hooks', () => {
    const fn = jest.fn();
    component.registerOnChange(fn);
    expect(component.onChange).toBe(fn);

    const fn2 = jest.fn();
    component.registerOnTouched(fn2);
    expect(component.onTouched).toBe(fn2);
  });

  it('should update value when writeValue is called', () => {
    component.writeValue(50);
    expect(component['values']).toEqual([50]);
    component.writeValue([25, 75]);
    expect(component['values']).toEqual([25]);
  });

  it('should update range values when writeValue is called with an array', () => {
    fixture.componentRef.setInput('range', true);
    component.writeValue([25, 75]);
    expect(component['values']).toEqual([25, 75]);
  });

  it('should update element styles when value changes', () => {
    component.value.set(50);
    fixture.detectChanges();
    const sliderMin = fixture.nativeElement.querySelector('[role="slider"] span');
    expect(sliderMin.style.left).toBe('50%');
  });

  it('should update element styles for range slider', () => {
    fixture.componentRef.setInput('range', true);
    component.value.set([25, 75]);
    fixture.detectChanges();
    const [sliderMin, sliderMax] = fixture.nativeElement.querySelectorAll('[role="slider"] span');
    expect(sliderMin.style.left).toBe('25%');
    expect(sliderMax.style.left).toBe('75%');
  });

  it('should round values to step', () => {
    fixture.componentRef.setInput('step', 5);
    component.value.set(22);
    fixture.detectChanges();
    expect(component['values']).toEqual([20]);
  });

  it('should clamp values to min and max', () => {
    fixture.componentRef.setInput('min', 10);
    fixture.componentRef.setInput('max', 90);
    component.value.set(-10);
    fixture.detectChanges();
    expect(component['values']).toEqual([10]);
    component.value.set(100);
    fixture.detectChanges();
    expect(component['values']).toEqual([90]);
  });

  it('should handle drag events', () => {
    mockDrag('start', 0, 50);
    mockDrag('end', 0, 50);
    expect(component.value()).toBeCloseTo(50, 0);
  });

  it('should handle drag events for range slider', () => {
    fixture.componentRef.setInput('range', true);
    mockDrag('start', 0, 25);
    mockDrag('move', 50, 75);
    mockDrag('end', 0, 75);
    expect(component.value()).toEqual([0, 75]);

    component.value.set([25, 40]);
    fixture.detectChanges();
    mockDrag('start', 0, 50);
    expect(component['activeIndex']).toBe(1);
    mockDrag('move', 20, 70);
    mockDrag('end', 0, 70);
    expect(component.value()).toEqual([25, 70]);

    mockDrag('start', 0, 15);
    expect(component['activeIndex']).toBe(0);
    mockDrag('move', -10, 5);
    mockDrag('end', 0, 5);
    expect(component.value()).toEqual([5, 70]);
  });

  it('should handle immediate updates', () => {
    fixture.componentRef.setInput('immediateUpdate', true);
    mockDrag('start', 0, 10);
    mockDrag('move', 20, 30);
    expect(component.value()).toBeCloseTo(30, 0);
  });

  it('should not update immediately when immediateUpdate is false', () => {
    fixture.componentRef.setInput('immediateUpdate', false);
    const initialValue = component.value();
    mockDrag('start', 0, 10);
    mockDrag('move', 20, 30);
    expect(component.value()).toBe(initialValue);
  });

  it('should update ARIA attributes', () => {
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 100);
    component.value.set(50);
    fixture.detectChanges();
    const sliderElement = fixture.nativeElement;
    expect(sliderElement.getAttribute('aria-valuemin')).toBe('0');
    expect(sliderElement.getAttribute('aria-valuemax')).toBe('100');
    expect(sliderElement.getAttribute('aria-valuenow')).toBe('50');
  });
});
