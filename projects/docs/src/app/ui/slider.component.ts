import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from '@meeui/ui/checkbox';
import { Slider } from '@meeui/ui/slider';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-slider',
  imports: [Heading, Slider, FormsModule, DocCode, Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="sliderPage">Slider</h4>

    <app-doc-code [tsCode]="tsCode">
      <mee-slider [value]="slider" [step]="10" [max]="200" [range]="true" class="w-64 md:w-96" />

      <mee-checkbox [(ngModel)]="disabled">Disabled</mee-checkbox>
      {{ test() }}
      <mee-slider
        [(value)]="test"
        [step]="0.1"
        [min]="-2"
        [max]="2"
        class="!mt-10 w-64 md:w-96"
        [disabled]="disabled()"
      />
    </app-doc-code>
  `,
})
export class SliderComponent {
  slider = [50, 100];
  test = signal(-1);
  disabled = signal(false);

  tsCode = `
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { Slider } from '@meeui/ui/slider';

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
