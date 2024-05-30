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
import { Drag, DragData } from '../drag';

@Component({
  selector: 'mee-slider',
  standalone: true,
  imports: [Drag],
  template: `
    <div class="h-full overflow-hidden rounded-full bg-background" meeDrag>
      <div class="h-full bg-primary" #track></div>
    </div>
    <span
      class="pointer-events-none absolute -top-1 inline-block h-4 w-4 -translate-x-1/2 rounded-full border border-primary bg-foreground shadow-md"
      #slider
    ></span>
  `,
  host: {
    class: 'block relative h-1.5 my-1',
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
  private drag = viewChild(Drag);
  el = inject(ElementRef);
  step = input(1);
  max = input(100);
  performance = input(true);
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
    return this.el.nativeElement.clientWidth;
  }

  getPercentage(value: number) {
    return (value / this.max()) * 100;
  }

  move(data: DragData) {
    requestAnimationFrame(() => this.moveSlider(data));
  }

  clicked(clientX: number) {
    const slider = this.el.nativeElement;
    const rect = slider.getBoundingClientRect();
    const x = clientX - rect.left;
    return this.perRound(x, this.width);
  }

  private perRound(x: number, width: number) {
    // the new percentage of the slider
    const percentage = (x / width) * 100;
    // convert percentage to value
    let value = (percentage / 100) * this.max();
    // we need to make the percentage to be a multiple of the step
    return parseFloat(
      (Math.round(value / this.step()) * this.step()).toFixed(10),
    );
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
      if (this.startValue != this.value()) {
        this.updateElement(this.startValue);
      }
    } else if (data.type === 'move') {
      // the new percentage of the slider
      const newSize = this.totalSliderWidth + data.x;
      const percentage = this.perRound(newSize, this.totalWidth);
      // update the value only when the percentage is different and within the range
      if (
        percentage >= 0 &&
        percentage <= this.max() &&
        percentage != this.startValue
      ) {
        this.startValue = percentage;
        this.updateElement(percentage);
        if (!this.performance()) {
          this.updateValue(percentage);
        }
      }
    } else {
      this.totalWidth = 0;
      this.totalSliderWidth = 0;
      if (this.startValue != this.value()) {
        this.updateValue(this.startValue);
      }
    }
  }

  private updateValue(percentage: number) {
    this.value.set(percentage);
    this.onChange(percentage);
    this.onTouched();
  }
}
