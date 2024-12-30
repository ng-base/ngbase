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
      <div meeSliderRange class="bg-primary aria-[disabled=true]:bg-muted-background"></div>
    </div>
    @for (thumb of noOfThumbs(); track thumb) {
      <button
        meeSliderThumb
        meeFocusStyle
        class="{{
          'inline-block h-b5 w-b5 rounded-full border-2 bg-foreground shadow-md aria-[disabled=false]:border-primary aria-[disabled=true]:bg-muted-background ' +
            (orientation() === 'vertical'
              ? '-left-b1.5 -translate-y-1/2'
              : '-top-b1.5 -translate-x-1/2')
        }}"
      ></button>
    }
  `,
  host: {
    class: 'block relative my-b',
    '[class]': 'orientation() === "vertical" ? "w-b2" : "h-b2"',
  },
})
export class Slider extends MeeSlider {}
