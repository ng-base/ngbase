import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbSlider, SliderRange, SliderThumb, SliderTrack, aliasSlider } from '@ngbase/adk/slider';
import { ɵFocusStyle as FocusStyle } from '@meeui/ui/checkbox';

@Component({
  selector: 'mee-slider',
  exportAs: 'meeSlider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasSlider(Slider)],
  imports: [FocusStyle, SliderTrack, SliderRange, SliderThumb],
  template: `
    <div
      ngbSliderTrack
      class="h-full overflow-hidden rounded-full bg-muted aria-[disabled=true]:bg-opacity-30"
    >
      <div ngbSliderRange class="bg-primary aria-[disabled=true]:bg-muted"></div>
    </div>
    @for (thumb of noOfThumbs(); track thumb) {
      <button
        ngbSliderThumb
        meeFocusStyle
        class="{{
          'inline-block h-5 w-5 rounded-full border-2 bg-background shadow-md aria-[disabled=false]:border-primary aria-[disabled=true]:bg-muted ' +
            (orientation() === 'vertical'
              ? '-left-1.5 -translate-y-1/2'
              : '-top-1.5 -translate-x-1/2')
        }}"
      ></button>
    }
  `,
  host: {
    class: 'block relative my-2 aria-[orientation=vertical]:w-2 aria-[orientation=horizontal]:h-2',
  },
})
export class Slider extends NgbSlider {}
