import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DragDirective, DragData } from '@meeui/drag';

@Component({
  selector: 'mee-slider',
  standalone: true,
  imports: [DragDirective],
  template: `
    <div class="bg-gy h-full overflow-hidden rounded-full">
      <div
        class="h-full bg-primary"
        [style.transform]="'translateX(-' + total() + '%)'"
      ></div>
    </div>
    <span
      class="absolute -top-1 inline-block h-4 w-4 -translate-x-1/2 rounded-full border border-primary bg-white shadow-md"
      [style.left]="sliderPosition() + '%'"
      (meeDrag)="move($event)"
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
  el = inject(ElementRef);
  step = input(1);
  max = input(100);
  value = signal(100);

  sliderPosition = computed(() => {
    const value = this.value();
    return (value / this.max()) * 100;
  });
  total = computed(() => {
    let percentage = this.sliderPosition();
    return 100 - percentage;
  });
  onChange = (value: number) => {};
  onTouched = () => {};

  totalWidth = 0;
  totalSliderWidth = 0;

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

  move(data: DragData) {
    // convert value to percentage based on the max value
    const valuePercentage = (this.value() / this.max()) * 100;
    if (data.type === 'start') {
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
      // update the value
      if (percentage != this.value()) {
        this.value.set(percentage);
        this.onChange(percentage);
        this.onTouched();
      }
    } else {
      this.totalWidth = 0;
      this.totalSliderWidth = 0;
    }
  }
}
