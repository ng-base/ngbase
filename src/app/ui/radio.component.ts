import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { RadioGroup, Radio } from '@meeui/radio';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-radio',
  imports: [Heading, RadioGroup, Radio, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="radioPage">Radio</h4>
    <mee-radio-group [(ngModel)]="radioValue">
      <mee-radio value="1">Radio 1</mee-radio>
      <mee-radio value="2">Radio 2</mee-radio>
      <mee-radio value="3">Radio 3</mee-radio>
    </mee-radio-group>
  `,
})
export class RadioComponent {
  radioValue = '1';
}
