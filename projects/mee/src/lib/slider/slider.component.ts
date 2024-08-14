import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  viewChild,
  effect,
  afterNextRender,
  model,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Drag, DragData } from '../drag';

@Component({
  selector: 'mee-slider',
  standalone: true,
  imports: [Drag],
  template: `
    <div meeDrag class="h-full overflow-hidden rounded-full bg-muted-background">
      <div class="h-full bg-primary" #track></div>
    </div>
    <span
      class="pointer-events-none absolute -top-b inline-block h-b4 w-b4 -translate-x-1/2 rounded-full border border-primary bg-foreground shadow-md"
      #sliderMin
    ></span>
    @if (range()) {
      <span
        class="pointer-events-none absolute -top-b inline-block h-b4 w-b4 -translate-x-1/2 rounded-full border border-primary bg-foreground shadow-md"
        #sliderMax
      ></span>
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Slider),
      multi: true,
    },
  ],
})
export class Slider implements ControlValueAccessor {
  private el = inject(ElementRef);
  private track = viewChild.required<ElementRef<HTMLElement>>('track');
  private sliderMin = viewChild.required<ElementRef<HTMLElement>>('sliderMin');
  private sliderMax = viewChild<ElementRef<HTMLElement>>('sliderMax');
  private drag = viewChild.required(Drag);

  readonly step = input(1);
  readonly min = input(0);
  readonly max = input(100);
  readonly range = input(false);
  readonly value = model<number | number[]>();
  readonly immediateUpdate = input(true);

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
    const [minPosition, maxPosition] = this.values.map(x => this.getPercentage(x));
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

  private getPercentage(value: number) {
    return (value / this.max()) * 100;
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
    return (percentage / 100) * this.max();
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
      const valuePercentage = this.getPercentage(this.startValue);
      // total width of the slider
      this.totalWidth = this.width;
      // the width of the slider using current percentage
      this.totalSliderWidth = this.totalWidth * (valuePercentage / 100);

      // find the nearest value index based on the percentage
      this.activeIndex = 0;
      if (this.range()) {
        const [min, max] = this.values;
        const minPercentage = this.getPercentage(min || 0);
        const maxPercentage = this.getPercentage(max || 0);
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
