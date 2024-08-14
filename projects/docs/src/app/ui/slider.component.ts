import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Slider } from '@meeui/slider';
import { FormsModule } from '@angular/forms';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-slider',
  imports: [Heading, Slider, FormsModule, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="sliderPage">Slider</h4>

    <app-doc-code [tsCode]="tsCode">
      <mee-slider
        [value]="slider"
        [step]="10"
        [max]="200"
        [range]="true"
        class="w-64 md:w-96"
      ></mee-slider>

      <mee-slider [value]="10" [step]="10" [max]="200" class="!mt-10 w-64 md:w-96"></mee-slider>
    </app-doc-code>
  `,
})
export class SliderComponent {
  slider = [50, 100];

  tsCode = `
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { Slider } from '@meeui/slider';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [FormsModule, Slider],
    template: \`
      <mee-slider
        [(ngModel)]="slider"
        [step]="1"
        [min]="0"
        [max]="200"
      />
    \`
  })
  export class AppComponent {
    slider = 50;
  }
  `;
}
