import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NgbSlider,
  SliderRange,
  SliderThumb,
  SliderTrack,
  provideSlider,
} from '@ngbase/adk/slider';

@Component({
  selector: 'mee-slider',
  exportAs: 'meeSlider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideSlider(Slider)],
  imports: [SliderTrack, SliderRange, SliderThumb],
  template: `
    <div
      ngbSliderTrack
      class="h-full overflow-hidden rounded-full bg-muted-background aria-[disabled=true]:bg-opacity-30"
    >
      <div ngbSliderRange class="bg-primary aria-[disabled=true]:bg-muted-background"></div>
    </div>
    @for (thumb of noOfThumbs(); track thumb) {
      <button
        ngbSliderThumb
        class="{{
          'inline-block h-5 w-5 rounded-full border-2 bg-foreground shadow-md aria-[disabled=false]:border-primary aria-[disabled=true]:bg-muted-background ' +
            (orientation() === 'vertical'
              ? '-left-1.5 -translate-y-1/2'
              : '-top-1.5 -translate-x-1/2')
        }}"
      ></button>
    }
  `,
  host: {
    class: 'block relative my-1',
    '[class]': 'orientation() === "vertical" ? "w-2" : "h-2"',
  },
})
export class Slider extends NgbSlider {}
