import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Slider } from '@meeui/slider';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-slider',
  imports: [Heading, Slider, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="sliderPage">Slider</h4>
    <mee-slider [(ngModel)]="slider" [step]="1" [max]="200"></mee-slider>
  `,
})
export class SliderComponent {
  slider = 50;
}
