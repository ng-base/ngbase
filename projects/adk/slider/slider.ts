import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  numberAttribute,
  Type,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Drag, DragData } from '@meeui/adk/drag';
import { provideValueAccessor } from '@meeui/adk/utils';

@Directive({
  selector: '[meeSliderTrack]',
  hostDirectives: [Drag],
  host: {
    style: 'overflow: hidden; position: relative;',
    '[attr.aria-disabled]': 'slider.disabled()',
  },
})
export class SliderTrack {
  readonly slider = inject(MeeSlider);
  private readonly drag = inject(Drag);

  constructor() {
    this.drag._disabled = linkedSignal(this.slider.disabled);
  }
}

@Directive({
  selector: '[meeSliderRange]',
  host: {
    '[attr.aria-disabled]': 'slider.disabled()',
    style: 'position: absolute;',
  },
})
export class SliderRange {
  readonly slider = inject(MeeSlider);
}

@Directive({
  selector: '[meeSliderThumb]',
  host: {
    type: 'button',
    role: 'slider',
    style: 'position: absolute; pointer-events: none;',
    '[attr.tabindex]': 'slider.disabled() ? -1 : 0',
    '[attr.aria-disabled]': 'slider.disabled()',
    '[attr.aria-valuemin]': 'slider.min()',
    '[attr.aria-valuemax]': 'slider.max()',
    '[attr.aria-valuenow]': 'value()',
  },
})
export class SliderThumb {
  readonly slider = inject(MeeSlider);
  readonly el = inject(ElementRef);

  readonly index = computed(() => {
    return this.slider.thumbs().findIndex(t => t.nativeElement === this.el.nativeElement);
  });
  readonly value = computed(() => {
    const values = this.slider.value();
    if (!values) return values;
    return this.slider.range() > 1 ? (values as number[])[this.index()] : values;
  });
}

@Component({
  selector: '[meeSlider]',
  exportAs: 'meeSlider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(MeeSlider)],
  imports: [SliderTrack, SliderRange, SliderThumb],
  template: `
    <div meeSliderTrack>
      <div meeSliderRange></div>
    </div>
    @for (thumb of noOfThumbs(); track thumb) {
      <button meeSliderThumb></button>
    }
  `,
})
export class MeeSlider implements ControlValueAccessor {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly drag = viewChild.required(Drag);
  private readonly track = viewChild.required<SliderRange, ElementRef<HTMLElement>>(SliderRange, {
    read: ElementRef,
  });
  readonly thumbs = viewChildren<SliderThumb, ElementRef<HTMLElement>>(SliderThumb, {
    read: ElementRef,
  });

  readonly value = model<number | number[]>();
  readonly step = input(1, { transform: numberAttribute });
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly range = input(1, { transform: numberAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  private onChange?: (value: number | number[]) => {};
  private onTouched?: () => {};

  readonly noOfThumbs = computed(() => Array.from({ length: this.range() }, (_, i) => i));
  private readonly totalSteps = computed(() => (this.max() - this.min()) / this.step());
  private values: number[] = [];
  private activeIndex = 0;
  private totalWidth = 0;
  private totalSliderWidth = 0;

  constructor() {
    effect(() => {
      const value = this.value() || 0;
      if (this.thumbs().length) {
        untracked(() => this.handleValueUpdate(value));
      }
    });

    afterNextRender(() => {
      this.drag().events.subscribe(data => this.move(data));
    });
  }

  private handleValueUpdate(value: number | number[]) {
    const values = this.values;
    const range = this.range() > 1;
    if ((range && value !== values) || (!range && value !== values[0])) {
      const v = Array.isArray(value) ? value : [value];
      this.values = v.map(v => this.fixStep(v));
    }

    this.updateElement();
  }

  private updateElement() {
    const positions = this.values.map(x => this.toPercentage(x));
    const isVertical = this.orientation() === 'vertical';
    const track = this.track().nativeElement;

    // Update thumb positions
    this.thumbs().forEach((thumb, i) => {
      const value = this.values[i];
      const pos = isVertical ? 100 - positions[i] : positions[i];
      const prop = isVertical ? 'top' : 'left';
      const thumbSize = this.getThumbSize(value, thumb.nativeElement.offsetWidth);
      thumb.nativeElement.style[prop] = `calc(${pos}% + ${isVertical ? -thumbSize : thumbSize}px)`;
    });

    // Update track position
    const [min, max] =
      positions.length > 1 ? [Math.min(...positions), Math.max(...positions)] : [0, positions[0]];

    if (isVertical) {
      track.style.top = 100 - max + '%';
      track.style.bottom = min + '%';
      track.style.width = '100%';
    } else {
      track.style.left = min + '%';
      track.style.right = 100 - max + '%';
      track.style.height = '100%';
    }
  }

  private getThumbSize(value: number, thumbSize: number = 0) {
    const currentStep = (value - this.min()) / this.step();
    const halfSteps = this.totalSteps() / 2;
    const halfThumbSize = thumbSize / 2;

    // Return 0 for middle, positive offset for first half, negative for second half
    const offset = currentStep - halfSteps;
    return -(offset / halfSteps) * halfThumbSize;
  }

  writeValue(value: number | number[]): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private get width() {
    return this.orientation() === 'vertical'
      ? this.el.nativeElement.clientHeight
      : this.el.nativeElement.clientWidth;
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
    const left = this.orientation() === 'vertical' ? rect.top : rect.left;
    return this.perRound(clientX - left, this.width, this.orientation() === 'vertical');
  }

  private perRound(x: number, width: number, reverse = false) {
    // the new percentage of the slider
    let percentage = (x / width) * 100;
    if (reverse) {
      percentage = 100 - percentage;
    }
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
    let cx = data.clientX!;
    let x = data.x!;
    if (this.orientation() === 'vertical') {
      cx = data.clientY!;
      x = -data.y!;
    }
    // convert value to percentage based on the max value
    if (data.type === 'start') {
      const clickedValue = this.clicked(cx);
      const valuePercentage = this.toPercentage(clickedValue);
      // total width of the slider
      this.totalWidth = this.width;
      // the width of the slider using current percentage
      this.totalSliderWidth = this.totalWidth * (valuePercentage / 100);

      // make sure the values are equal length as the range
      if (this.values.length !== this.range()) {
        this.values = Array.from({ length: this.range() }, (_, i) => this.values[i] || this.min());
      }
      // sort the values
      this.values = this.values.sort((a, b) => a - b);

      // find the nearest value index based on the percentage
      this.activeIndex = this.values.reduce((closestIndex, value, index) => {
        const diff = Math.abs(this.toPercentage(value) - valuePercentage);
        return diff < Math.abs(this.toPercentage(this.values[closestIndex]) - valuePercentage)
          ? index
          : closestIndex;
      }, 0);
      this.updateValue(this.activeIndex, clickedValue);
      if (this.values[this.activeIndex] !== this.value()) {
        this.notifyChange();
      }
    } else if (data.type === 'move') {
      // the new percentage of the slider
      const newSize = this.totalSliderWidth + x;
      const percentage = this.perRound(newSize, this.totalWidth);
      // update the value only when the percentage is different and within the range
      const prevValue = this.values[this.activeIndex];
      const currentValue = this.updateValue(this.activeIndex, percentage);
      if (prevValue !== currentValue) {
        this.notifyChange();
      }
    } else {
      this.totalWidth = 0;
      this.totalSliderWidth = 0;
    }
  }

  private updateValue(index: number, value: number) {
    const values = this.values;
    let stepValue = this.fixStep(value);

    // Clamp the value between min and max
    stepValue = Math.max(this.min(), Math.min(this.max(), stepValue));
    values[index] = stepValue;

    this.values = values.sort((a, b) => a - b);
    this.activeIndex = this.values.findIndex(v => v === stepValue);
    return stepValue;
  }

  private notifyChange() {
    const percentage = this.range() > 1 ? [...this.values] : this.values[0];
    this.value.set(percentage);
    this.onChange?.(percentage);
    this.onTouched?.();
  }
}

export const provideSlider = (slider: Type<MeeSlider>) => [
  { provide: MeeSlider, useExisting: slider },
  provideValueAccessor(slider),
];
