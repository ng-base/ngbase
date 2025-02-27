import { DragData } from '@ngbase/adk/drag';
import { render, RenderResult } from '@ngbase/adk/test';
import { aliasSlider, NgbSlider, SliderRange, SliderThumb, SliderTrack } from './slider';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: '[ngbSlider]',
  exportAs: 'ngbSlider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasSlider(TestSlider)],
  imports: [SliderTrack, SliderRange, SliderThumb],
  template: `
    <div ngbSliderTrack>
      <div ngbSliderRange></div>
    </div>
    @for (thumb of noOfThumbs(); track thumb) {
      <button ngbSliderThumb></button>
    }
  `,
})
class TestSlider extends NgbSlider {}

@Component({
  imports: [TestSlider, FormsModule],
  template: `<div
    ngbSlider
    [range]="range()"
    [(ngModel)]="value"
    [step]="step()"
    [min]="min()"
    [max]="max()"
  ></div>`,
})
class TestComponent {
  readonly range = signal(1);
  readonly value = signal<any>(0);
  readonly step = signal(1);
  readonly min = signal(0);
  readonly max = signal(100);
  readonly immediateUpdate = signal(true);
}

describe('Slider', () => {
  let component: NgbSlider;
  let view: RenderResult<TestComponent>;

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
    view = await render(TestComponent);
    component = view.viewChild(NgbSlider);
    view.detectChanges();

    // Mock the element
    component['el'].nativeElement = {
      clientWidth: 100,
      getBoundingClientRect: () => ({ left: 0, top: 0 }) as DOMRect,
    } as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.step()).toBe(1);
    expect(component.min()).toBe(0);
    expect(component.max()).toBe(100);
    expect(component.range()).toBe(1);
  });

  it('should set the form hooks', () => {
    const fn = jest.fn();
    component.registerOnChange(fn);
    expect(component['onChange']).toBe(fn);

    const fn2 = jest.fn();
    component.registerOnTouched(fn2);
    expect(component['onTouched']).toBe(fn2);
  });

  it('should maintain the values length when the range changes', async () => {
    view.host.range.set(2);
    view.host.min.set(10);
    view.host.value.set(0);
    await view.formStable();
    stimulateDrag('start', 0, 50);
    expect(component['values']).toEqual([10, 55]);
  });

  it('should sort the values when the value changes', async () => {
    view.host.value.set([75, 25]);
    view.host.range.set(2);
    await view.formStable();
    stimulateDrag('start', 0, 75);
    expect(component['values']).toEqual([25, 75]);
  });

  it('should update range values when writeValue is called with an array', async () => {
    view.host.range.set(2);
    view.host.value.set([25, 75]);
    await view.formStable();
    expect(component['values']).toEqual([25, 75]);
  });

  it('should update element styles when value changes', async () => {
    view.host.value.set(50);
    await view.formStable();
    const sliderMin = view.$('[role="slider"]');
    expect(sliderMin.el.style.left).toBe('calc(50% + 0px)');
  });

  it('should update element styles for range slider', async () => {
    view.host.range.set(2);
    view.host.value.set([25, 75]);
    await view.formStable();
    const [sliderMin, sliderMax] = view.$All('[role="slider"]');
    expect(sliderMin.el.style.left).toBe('calc(25% + 0px)');
    expect(sliderMax.el.style.left).toBe('calc(75% + 0px)');
  });

  it('should round values to step', async () => {
    view.host.step.set(5);
    view.host.value.set(22);
    await view.formStable();
    expect(component['values']).toEqual([20]);
  });

  it('should clamp values to min and max', async () => {
    view.host.min.set(10);
    view.host.max.set(90);
    view.host.value.set(-10);
    await view.formStable();
    expect(component['values']).toEqual([10]);
    view.host.value.set(100);
    await view.formStable();
    expect(component['values']).toEqual([90]);
  });

  it('should handle negative values', () => {
    view.host.min.set(-2);
    view.host.max.set(2);
    view.detectChanges();
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

  it('should update ARIA attributes', async () => {
    const values = [25, 75];
    view.host.value.set(values);
    view.host.range.set(2);
    view.host.min.set(0);
    view.host.max.set(100);
    await view.formStable();

    view.$All(SliderThumb).forEach((sliderElement, i) => {
      expect(sliderElement.attr('aria-valuemin')).toBe('0');
      expect(sliderElement.attr('aria-valuemax')).toBe('100');
      expect(sliderElement.attr('aria-valuenow')).toBe(values[i].toString());
    });
  });

  describe('drag', () => {
    it('should handle drag events for range slider', async () => {
      view.host.range.set(2);
      view.detectChanges();
      stimulateDrag('start', 0, 25);
      stimulateDrag('move', 50, 75);
      stimulateDrag('end', 0, 75);
      expect(component.value()).toEqual([0, 75]);
    });

    it('should handle activeIndex on drag events for 2 range slider', async () => {
      view.host.range.set(2);
      view.host.value.set([25, 40]);
      await view.formStable();
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

    it('should handle activeIndex on drag events for 3 range slider', async () => {
      view.host.range.set(3);
      view.host.value.set([25, 40, 55]);
      await view.formStable();

      stimulateDrag('start', 0, 20);
      expect(component['activeIndex']).toBe(0);

      stimulateDrag('move', 20, 40);
      expect(component['activeIndex']).toBe(0);

      stimulateDrag('move', 25, 45);
      expect(component['activeIndex']).toBe(1);

      stimulateDrag('move', 35, 55);
      expect(component['activeIndex']).toBe(1);

      stimulateDrag('move', 55, 75);
      expect(component['activeIndex']).toBe(2);

      stimulateDrag('move', 35, 55);
      expect(component['activeIndex']).toBe(1);

      stimulateDrag('move', 0, 20);
      expect(component['activeIndex']).toBe(0);
    });
  });
});
