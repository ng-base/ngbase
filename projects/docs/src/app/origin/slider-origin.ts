import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Slider } from '@meeui/ui/slider';

@Component({
  selector: 'app-slider-origin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Slider],
  template: `
    <h1 class="mb-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">Slider</h1>
    <section
      class="grid max-w-6xl grid-cols-1 overflow-hidden sm:grid-cols-2 lg:grid-cols-3 [&>*]:relative [&>*]:px-1 [&>*]:py-12 [&>*]:before:absolute [&>*]:before:bg-border/70 [&>*]:before:[block-size:100vh] [&>*]:before:[inline-size:1px] [&>*]:before:[inset-block-start:0] [&>*]:before:[inset-inline-start:-1px] [&>*]:after:absolute [&>*]:after:bg-border/70 [&>*]:after:[block-size:1px] [&>*]:after:[inline-size:100vw] [&>*]:after:[inset-block-start:-1px] [&>*]:after:[inset-inline-start:0] sm:[&>*]:px-8 xl:[&>*]:px-12"
    >
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Simple slider - {{ value() }}</h4>
        <mee-slider
          range="2"
          [min]="0"
          [max]="1000"
          [step]="1"
          [(value)]="value"
          orientation="vertical"
          class="mx-auto h-40"
        />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Disabled slider</h4>
        <mee-slider [disabled]="true" [min]="0" [max]="100" [step]="1" [value]="50" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Slider with square thumb</h4>
        <mee-slider [min]="0" [max]="10" [step]="1" [value]="5" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Slider with solid thumb</h4>
        <mee-slider [min]="0" [max]="100" [step]="1" [value]="50" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Slider with tiny thumb</h4>
        <mee-slider [min]="0" [max]="100" [step]="1" [value]="50" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Slider with reference labels</h4>
        <div>
          <mee-slider [min]="0" [max]="100" [step]="1" [value]="50" />
          <span
            class="mt-4 flex w-full items-center justify-between gap-1 text-xs font-medium text-muted"
          >
            <span>5 GB</span>
            <span>20 GB</span>
            <span>35 GB</span>
          </span>
        </div>
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Slider with ticks</h4>
        <div>
          <mee-slider [min]="0" [max]="12" [step]="1" [value]="0" />
          <span
            class="text-muted-foreground mt-3 flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium"
            aria-hidden="true"
            ><span class="flex w-0 flex-col items-center justify-center gap-2"
              ><span class="h-1 w-px bg-muted"></span><span class="">0</span></span
            ><span class="flex w-0 flex-col items-center justify-center gap-2"
              ><span class="h-0.5 w-px bg-muted/70"></span><span class="opacity-0">1</span></span
            ><span class="flex w-0 flex-col items-center justify-center gap-2"
              ><span class="h-1 w-px bg-muted/70"></span><span class="">2</span></span
            ><span class="flex w-0 flex-col items-center justify-center gap-2"
              ><span class="h-0.5 w-px bg-muted/70"></span><span class="opacity-0">3</span></span
            ><span class="flex w-0 flex-col items-center justify-center gap-2"
              ><span class="h-1 w-px bg-muted/70"></span><span class="">4</span></span
            ><span class="flex w-0 flex-col items-center justify-center gap-2"
              ><span class="h-0.5 w-px bg-muted/70"></span><span class="opacity-0">5</span></span
            ><span class="flex w-0 flex-col items-center justify-center gap-2"
              ><span class="h-1 w-px bg-muted/70"></span><span class="">6</span></span
            ><span class="flex w-0 flex-col items-center justify-center gap-2"
              ><span class="h-0.5 w-px bg-muted/70"></span><span class="opacity-0">7</span></span
            ><span class="flex w-0 flex-col items-center justify-center gap-2"
              ><span class="h-1 w-px bg-muted/70"></span><span class="">8</span></span
            ><span class="flex w-0 flex-col items-center justify-center gap-2"
              ><span class="h-0.5 w-px bg-muted/70"></span><span class="opacity-0">9</span></span
            ><span class="flex w-0 flex-col items-center justify-center gap-2"
              ><span class="h-1 w-px bg-muted/70"></span><span class="">10</span></span
            ><span class="flex w-0 flex-col items-center justify-center gap-2"
              ><span class="h-0.5 w-px bg-muted/70"></span><span class="opacity-0">11</span></span
            ><span class="flex w-0 flex-col items-center justify-center gap-2"
              ><span class="h-1 w-px bg-muted/70"></span><span class="">12</span></span
            ></span
          >
        </div>
      </div>
      <div class="space-y-4 p-8">
        <h4 class="flex justify-between py-2 font-semibold">
          Slider with output
          <output class="text-sm font-medium tabular-nums">{{ slider.value() }}</output>
        </h4>
        <mee-slider [min]="0" [max]="100" [step]="1" [value]="50" #slider="meeSlider" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Slider with labels</h4>
        <mee-slider [min]="0" [max]="100" [step]="1" [value]="50" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Slider with labels and tooltip</h4>
        <mee-slider [min]="0" [max]="100" [step]="1" [value]="50" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Dual range slider</h4>
        <mee-slider range="2" [min]="0" [max]="100" [step]="1" [value]="[25, 75]" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="flex justify-between py-2 font-semibold">
          Dual range slider with output
          <output class="text-sm font-medium tabular-nums"
            >{{ $any(sliderDo.value())?.[0] }} - {{ $any(sliderDo.value())?.[1] }}</output
          >
        </h4>
        <mee-slider
          #sliderDo="meeSlider"
          range="2"
          [min]="0"
          [max]="100"
          [step]="1"
          [value]="[25, 75]"
        />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="flex justify-between py-2 font-semibold">
          Volume
          <output class="text-sm font-medium tabular-nums">{{ sliderVolume.value() }}</output>
        </h4>
        <mee-slider #sliderVolume="meeSlider" [min]="0" [max]="100" [step]="1" [value]="40" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Slider with multiple thumbs</h4>
        <mee-slider range="3" [min]="0" [max]="100" [step]="1" [value]="[25, 50, 95]" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Temperature</h4>
        <mee-slider [min]="0" [max]="100" [step]="1" [value]="25" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Slider with input</h4>
        <mee-slider [min]="0" [max]="100" [step]="1" [value]="25" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Rate your experience</h4>
        <mee-slider [min]="0" [max]="100" [step]="1" [value]="25" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Rate your experience</h4>
        <mee-slider [min]="0" [max]="100" [step]="1" [value]="25" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Dual range slider with input</h4>
        <mee-slider range="2" [min]="0" [max]="100" [step]="1" [value]="[25, 50]" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">100 credits/mo</h4>
        <mee-slider [min]="0" [max]="100" [step]="1" [value]="25" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">From $5 to $1,240+</h4>
        <mee-slider range="2" [min]="0" [max]="100" [step]="1" [value]="[0, 100]" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Vertical slider</h4>
        <div class="flex justify-center">
          <mee-slider
            [min]="0"
            [max]="100"
            [step]="1"
            [value]="25"
            orientation="vertical"
            class="h-40"
          />
        </div>
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Vertical slider with input</h4>
        <div class="flex justify-center">
          <mee-slider
            [min]="0"
            [max]="100"
            [step]="1"
            [value]="25"
            orientation="vertical"
            class="h-40"
          />
        </div>
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Vertical dual range slider and tooltip</h4>
        <div class="flex justify-center">
          <mee-slider
            range="2"
            [min]="0"
            [max]="100"
            [step]="1"
            [value]="[25, 50]"
            orientation="vertical"
            class="h-40"
          />
        </div>
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Object position</h4>
        <div class="flex flex-col gap-4">
          <mee-slider [min]="0" [max]="100" [step]="1" [value]="25" />
          <mee-slider [min]="0" [max]="100" [step]="1" [value]="25" />
          <mee-slider [min]="0" [max]="100" [step]="1" [value]="25" />
        </div>
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Price slider</h4>
        <mee-slider range="2" [min]="0" [max]="100" [step]="1" [value]="[25, 50]" />
      </div>
      <div class="space-y-4 p-8">
        <h4 class="py-2 font-semibold">Equalizer</h4>
        <div class="flex justify-center gap-8">
          <mee-slider
            [min]="0"
            [max]="100"
            [step]="1"
            [value]="25"
            orientation="vertical"
            class="h-40"
          />
          <mee-slider
            [min]="0"
            [max]="100"
            [step]="1"
            [value]="25"
            orientation="vertical"
            class="h-40"
          />
          <mee-slider
            [min]="0"
            [max]="100"
            [step]="1"
            [value]="25"
            orientation="vertical"
            class="h-40"
          />
          <mee-slider
            [min]="0"
            [max]="100"
            [step]="1"
            [value]="25"
            orientation="vertical"
            class="h-40"
          />
          <mee-slider
            [min]="0"
            [max]="100"
            [step]="1"
            [value]="25"
            orientation="vertical"
            class="h-40"
          />
        </div>
      </div>
    </section>
  `,
})
export default class SliderOrigin {
  value = signal([250, 700]);
}
