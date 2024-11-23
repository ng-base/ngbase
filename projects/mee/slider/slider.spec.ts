import { DragData } from '@meeui/adk/drag';
import { render, RenderResult } from '@meeui/adk/test';
import { Slider } from './slider';

describe('Slider', () => {
  let component: Slider;
  let view: RenderResult<Slider>;

  function stimulateDrag(type: 'start' | 'move' | 'end', x: number, clientX: number) {
    const dragEvent = {
      type,
      x,
      clientX,
      event: new MouseEvent('mousemove'),
    } as DragData;
    component['moveSlider'](dragEvent);
  }

  beforeEach(async () => {
    view = await render(Slider);
    component = view.host;
    view.detectChanges();

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
    view.setInput('range', true);
    component.writeValue([25, 75]);
    expect(component['values']).toEqual([25, 75]);
  });

  it('should update element styles when value changes', () => {
    component.value.set(50);
    view.detectChanges();
    const sliderMin = view.$('[role="slider"] button');
    expect(sliderMin.style.left).toBe('50%');
  });

  it('should update element styles for range slider', () => {
    view.setInput('range', true);
    component.value.set([25, 75]);
    view.detectChanges();
    const [sliderMin, sliderMax] = view.$All('[role="slider"] button');
    expect(sliderMin.style.left).toBe('25%');
    expect(sliderMax.style.left).toBe('75%');
  });

  it('should round values to step', () => {
    view.setInput('step', 5);
    component.value.set(22);
    view.detectChanges();
    expect(component['values']).toEqual([20]);
  });

  it('should clamp values to min and max', () => {
    view.setInput('min', 10);
    view.setInput('max', 90);
    component.value.set(-10);
    view.detectChanges();
    expect(component['values']).toEqual([10]);
    component.value.set(100);
    view.detectChanges();
    expect(component['values']).toEqual([90]);
  });

  it('should handle negative values', () => {
    view.setInput('min', -2);
    view.setInput('max', 2);
    stimulateDrag('start', 0, 25);
    stimulateDrag('end', 0, 25);
    expect(component.value()).toBe(-1);
    stimulateDrag('start', 0, 50);
    stimulateDrag('move', 25, 75);
    stimulateDrag('end', 0, 75);
    expect(component.value()).toBe(1);
  });

  it('should handle drag events', () => {
    stimulateDrag('start', 0, 50);
    stimulateDrag('end', 0, 50);
    expect(component.value()).toBeCloseTo(50, 0);
  });

  it('should handle drag events for range slider', () => {
    view.setInput('range', true);
    stimulateDrag('start', 0, 25);
    stimulateDrag('move', 50, 75);
    stimulateDrag('end', 0, 75);
    expect(component.value()).toEqual([0, 75]);

    component.value.set([25, 40]);
    view.detectChanges();
    stimulateDrag('start', 0, 50);
    expect(component['activeIndex']).toBe(1);
    stimulateDrag('move', 20, 70);
    stimulateDrag('end', 0, 70);
    expect(component.value()).toEqual([25, 70]);

    stimulateDrag('start', 0, 15);
    expect(component['activeIndex']).toBe(0);
    stimulateDrag('move', -10, 5);
    stimulateDrag('end', 0, 5);
    expect(component.value()).toEqual([5, 70]);
  });

  it('should handle immediate updates', () => {
    view.setInput('immediateUpdate', true);
    stimulateDrag('start', 0, 10);
    stimulateDrag('move', 20, 30);
    expect(component.value()).toBeCloseTo(30, 0);
  });

  it('should not update immediately when immediateUpdate is false', () => {
    view.setInput('immediateUpdate', false);
    const initialValue = component.value();
    stimulateDrag('start', 0, 10);
    stimulateDrag('move', 20, 30);
    expect(component.value()).toBe(initialValue);
  });

  it('should update ARIA attributes', () => {
    view.setInput('min', 0);
    view.setInput('max', 100);
    component.value.set(50);
    view.detectChanges();
    const sliderElement = view.fixture.nativeElement;
    expect(sliderElement.getAttribute('aria-valuemin')).toBe('0');
    expect(sliderElement.getAttribute('aria-valuemax')).toBe('100');
    expect(sliderElement.getAttribute('aria-valuenow')).toBe('50');
  });
});
