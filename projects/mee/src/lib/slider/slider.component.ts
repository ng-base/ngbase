import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
  effect,
  afterNextRender,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DragDirective, DragData } from '../drag';

@Component({
  selector: 'mee-slider',
  standalone: true,
  imports: [DragDirective],
  template: `
    <div class="bg-background h-full overflow-hidden rounded-full">
      <div class="h-full bg-primary" #track></div>
    </div>
    <span
      class="bg-foreground absolute -top-1 inline-block h-4 w-4 -translate-x-1/2 rounded-full border border-primary shadow-md"
      #slider
      meeDrag
    ></span>
  `,
  host: {
    class: 'block relative h-2 my-1',
    role: 'progressbar',
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
  private slider = viewChild<ElementRef<HTMLElement>>('slider');
  private track = viewChild<ElementRef<HTMLElement>>('track');
  private drag = viewChild(DragDirective);
  el = inject(ElementRef);
  step = input(1);
  max = input(100);
  value = signal(100);

  sliderPosition = computed(() => this.getPercentage(this.value()));
  total = computed(() => {
    let percentage = this.sliderPosition();
    return 100 - percentage;
  });
  onChange = (value: number) => {};
  onTouched = () => {};

  totalWidth = 0;
  totalSliderWidth = 0;
  startValue = 0;

  constructor() {
    effect(() => {
      const value = this.value();
      if (this.slider()) {
        this.updateElement(value);
      }
    });

    afterNextRender(() => {
      this.drag()!.events.subscribe((data) => this.move(data));
    });
  }

  private updateElement(value: number) {
    const sliderPosition = this.getPercentage(value);
    this.slider()!.nativeElement.style.left = sliderPosition + '%';
    this.track()!.nativeElement.style.transform =
      'translateX(-' + (100 - sliderPosition) + '%)';
  }

  writeValue(value: number): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  get width() {
    return this.el.nativeElement.getBoundingClientRect().width;
  }

  getPercentage(value: number) {
    return (value / this.max()) * 100;
  }

  move(data: DragData) {
    this.moveSlider(data);
    requestAnimationFrame(() => this.moveSlider(data));
  }

  private moveSlider(data: DragData) {
    data.event?.preventDefault();
    // convert value to percentage based on the max value
    if (data.type === 'start') {
      this.startValue = this.value();
      const valuePercentage = this.getPercentage(this.startValue);
      // total width of the slider
      this.totalWidth = this.width;
      // the width of the slider using current percentage
      this.totalSliderWidth = this.totalWidth * (valuePercentage / 100);
    } else if (data.type === 'move') {
      // the new percentage of the slider
      const newSize = this.totalSliderWidth + data.x;
      // the new percentage of the slider
      let percentage = (newSize / this.totalWidth) * 100;
      // convert percentage to value
      percentage = (percentage / 100) * this.max();
      // we need to make the percentage to be a multiple of the step
      percentage = Math.round(percentage / this.step()) * this.step();
      // update the value only when the percentage is different and within the range
      if (
        percentage >= 0 &&
        percentage <= this.max() &&
        percentage != this.startValue
      ) {
        this.startValue = percentage;
        this.updateElement(percentage);
      }
    } else {
      this.totalWidth = 0;
      this.totalSliderWidth = 0;
      if (this.startValue != this.value()) {
        this.value.set(this.startValue);
        this.onChange(this.startValue);
        this.onTouched();
      }
    }
  }
}
