import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  model,
  numberAttribute,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ɵFocusStyle as FocusStyle } from '@meeui/ui/checkbox';
import { Drag, DragData } from '@meeui/adk/drag';
import { provideValueAccessor } from '@meeui/adk/utils';

@Component({
  selector: 'mee-slider',
  imports: [Drag, FocusStyle],
  template: `
    <div
      meeDrag
      [disabled]="disabled()"
      class="h-full overflow-hidden rounded-full bg-muted-background"
      [class]="disabled() ? 'bg-opacity-30' : ''"
    >
      <div class="h-full" [class]="disabled() ? 'bg-muted-background' : 'bg-primary'" #track></div>
    </div>
    <button
      type="button"
      meeFocusStyle
      class="pointer-events-none absolute -top-b inline-block h-b4 w-b4 -translate-x-1/2 rounded-full border bg-foreground shadow-md"
      [class]="disabled() ? 'bg-muted-background' : 'border-primary'"
      #sliderMin
    ></button>
    @if (range()) {
      <button
        type="button"
        meeFocusStyle
        class="pointer-events-none absolute -top-b inline-block h-b4 w-b4 -translate-x-1/2 rounded-full border border-primary bg-foreground shadow-md"
        [class]="disabled() ? 'bg-muted-background' : 'border-primary'"
        #sliderMax
      ></button>
    }
  `,
  host: {
    class: 'block relative h-b2 my-b',
    role: 'slider',
    '[attr.aria-valuemin]': 'min()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'value()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(Slider)],
})
export class Slider implements ControlValueAccessor {
  private el = inject(ElementRef);
  private drag = viewChild.required(Drag);
  private track = viewChild.required<ElementRef<HTMLElement>>('track');
  private sliderMin = viewChild.required<ElementRef<HTMLElement>>('sliderMin');
  private sliderMax = viewChild<ElementRef<HTMLElement>>('sliderMax');

  readonly value = model<number | number[]>();
  readonly step = input(1, { transform: numberAttribute });
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly range = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly immediateUpdate = input(true, { transform: booleanAttribute });

  onChange?: (value: number | number[]) => {};
  onTouched?: () => {};

  private readonly values: number[] = [];
  private activeIndex = 0;
  private totalWidth = 0;
  private totalSliderWidth = 0;
  private startValue = 0;

  constructor() {
    effect(() => {
      const value = this.value() ?? this.values;
      this.handleValueUpdate(value);
    });

    afterNextRender(() => {
      this.drag().events.subscribe(data => this.move(data));
    });
  }

  private handleValueUpdate(value: number | number[]) {
    const v = Array.isArray(value) ? value : [value];
    this.values[0] = this.fixStep(v[0]);
    if (this.range()) {
      this.updateValue(1, v[1], false);
    }
    this.updateElement();
  }

  private updateElement() {
    const [minPosition, maxPosition] = this.values.map(x => this.toPercentage(x));
    this.sliderMin().nativeElement.style.left = minPosition + '%';
    const track = this.track().nativeElement;
    const sliderMax = this.sliderMax();
    if (sliderMax) {
      sliderMax.nativeElement.style.left = maxPosition + '%';
      track.style.width = maxPosition - minPosition + '%';
      track.style.marginLeft = minPosition + '%';
      track.style.transform = '';
    } else {
      track.style.transform = 'translateX(' + (minPosition - 100) + '%)';
    }
  }

  writeValue(value: number | number[]): void {
    this.handleValueUpdate(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private get width() {
    return this.el.nativeElement.clientWidth;
  }

  // We need to consider the min value also because the slider can be negative
  private toPercentage(value: number) {
    const min = this.min();
    const max = this.max();
    const range = max - min;
    const percentage = ((value - min) / range) * 100;
    return percentage;
  }

  private fromPercentage(percentage: number) {
    const min = this.min();
    const max = this.max();
    const range = max - min;
    const value = (percentage / 100) * range + min;
    return value;
  }

  private move(data: DragData) {
    requestAnimationFrame(() => this.moveSlider(data));
  }

  private clicked(clientX: number) {
    const slider = this.el.nativeElement;
    const rect = slider.getBoundingClientRect();
    const x = clientX - rect.left;
    return this.perRound(x, this.width);
  }

  private perRound(x: number, width: number) {
    // the new percentage of the slider
    const percentage = (x / width) * 100;
    // convert percentage to value
    return this.fromPercentage(percentage);
  }

  private fixStep(value = this.min()) {
    // make sure the value is within the min and max
    // we need to make the percentage to be a multiple of the step
    value = parseFloat((Math.round(value / this.step()) * this.step()).toFixed(10));
    return Math.max(this.min(), Math.min(this.max(), value));
  }

  private moveSlider(data: DragData) {
    data.event?.preventDefault();
    // convert value to percentage based on the max value
    if (data.type === 'start') {
      this.clicked(data.clientX!);
      this.startValue = this.clicked(data.clientX!);
      const valuePercentage = this.toPercentage(this.startValue);
      // total width of the slider
      this.totalWidth = this.width;
      // the width of the slider using current percentage
      this.totalSliderWidth = this.totalWidth * (valuePercentage / 100);

      // find the nearest value index based on the percentage
      this.activeIndex = 0;
      if (this.range()) {
        const [min, max] = this.values;
        const minPercentage = this.toPercentage(min || 0);
        const maxPercentage = this.toPercentage(max || 0);
        const minDiff = Math.abs(minPercentage - valuePercentage);
        const maxDiff = Math.abs(maxPercentage - valuePercentage);
        this.activeIndex = minDiff < maxDiff ? 0 : 1;
      }
      this.updateValue(this.activeIndex, this.startValue);
    } else if (data.type === 'move') {
      // the new percentage of the slider
      const newSize = this.totalSliderWidth + data.x;
      let percentage = this.perRound(newSize, this.totalWidth);
      // update the value only when the percentage is different and within the range
      percentage = this.updateValue(this.activeIndex, percentage);
      if (this.startValue !== percentage) {
        this.startValue = percentage;
        if (this.immediateUpdate()) this.notifyChange();
      }
    } else {
      this.totalWidth = 0;
      this.totalSliderWidth = 0;
      if (this.values[this.activeIndex] !== this.value()) {
        this.notifyChange();
      }
    }
  }

  private updateValue(index: number, value: number, notify = true) {
    const prev = this.values[index];
    this.values[index] = this.fixStep(value);
    const [min = 0, max = 0] = this.values;
    if (index === 0) {
      this.values[0] = this.range() ? Math.min(min, max, this.max()) : Math.min(min, this.max());
    } else {
      this.values[1] = Math.max(min, max, this.min());
    }
    if (this.values[index] !== prev && notify) {
      this.updateElement();
    }
    return this.values[index];
  }

  private notifyChange() {
    const percentage = this.range() ? this.values : this.values[0];
    this.value.set(percentage);
    this.onChange?.(percentage);
    this.onTouched?.();
  }
}
