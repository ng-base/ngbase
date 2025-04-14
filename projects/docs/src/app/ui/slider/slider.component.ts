import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Checkbox } from '@meeui/ui/checkbox';
import { Slider } from '@meeui/ui/slider';
import { Heading } from '@meeui/ui/typography';
import { DocCode, getCode } from '../code.component';

@Component({
  selector: 'app-slider',
  imports: [Heading, Slider, FormsModule, DocCode, Checkbox, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="sliderPage">Slider</h4>

    <app-doc-code [tsCode]="tsCode()" [adkCode]="adkCode()">
      <mee-slider [(value)]="slider" [step]="10" [max]="200" [range]="3" class="w-64 md:w-96" />

      <mee-checkbox [(ngModel)]="disabled">Disabled</mee-checkbox>
      {{ form.value.test }}
      <form [formGroup]="form">
        <mee-slider
          formControlName="test"
          [step]="0.1"
          [min]="-2"
          [max]="2"
          class="!mt-10 w-64 md:w-96"
        />
      </form>
    </app-doc-code>
  `,
})
export default class SliderComponent {
  slider = signal([50, 100, 150]);
  test = -1;
  disabled = signal(false);

  readonly form = new FormGroup({
    test: new FormControl(-1),
  });

  tsCode = getCode('slider/slider-usage.ts');
  adkCode = getCode('slider/slider-adk.ts');
}
