import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeSlider, SliderRange, SliderThumb, SliderTrack, provideSlider } from '@meeui/adk/slider';
import { ɵFocusStyle as FocusStyle } from '@meeui/ui/checkbox';

@Component({
  selector: 'mee-slider',
  exportAs: 'meeSlider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideSlider(Slider)],
  imports: [FocusStyle, SliderTrack, SliderRange, SliderThumb],
  template: `
    <div
      meeSliderTrack
      class="h-full overflow-hidden rounded-full bg-muted-background aria-[disabled=true]:bg-opacity-30"
    >
      <div meeSliderRange class="h-full bg-primary aria-[disabled=true]:bg-muted-background"></div>
    </div>
    @for (thumb of noOfThumbs(); track thumb) {
      <button
        meeSliderThumb
        meeFocusStyle
        class="pointer-events-none absolute -top-b1.5 inline-block h-b5 w-b5 -translate-x-1/2 rounded-full border bg-foreground shadow-md aria-[disabled=false]:border-primary aria-[disabled=true]:bg-muted-background"
      ></button>
    }
  `,
  host: {
    class: 'block relative h-b2 my-b',
  },
})
export class Slider extends MeeSlider {}
