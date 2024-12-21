import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from '@meeui/ui/card';
import { Radio, RadioGroup } from '@meeui/ui/radio';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-radio',
  imports: [Heading, RadioGroup, Radio, Card, FormsModule, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="radioPage">Radio</h4>

    <app-doc-code [tsCode]="tsCode">
      <mee-radio-group [(ngModel)]="radioValue">
        <mee-radio value="1">Radio 1</mee-radio>
        <mee-radio value="2">Radio 2</mee-radio>
        <mee-radio value="3" disabled>Radio 3</mee-radio>
      </mee-radio-group>
      <mee-radio-group [(ngModel)]="radioValue" class="mt-10 grid w-full gap-b4 md:w-96">
        <mee-card class="!py-b2">
          <mee-radio value="1">
            <div class="ml-b2">
              <h4 meeHeader="xs">Radio 1</h4>
              <p class="text-muted">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere
                minus minima quis.
              </p>
            </div>
          </mee-radio>
        </mee-card>
        <mee-card class="!py-b2">
          <mee-radio value="2">
            <div class="ml-b2">
              <h4 meeHeader="xs">Radio 2</h4>
              <p class="text-muted">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere
                minus minima quis.
              </p>
            </div>
          </mee-radio>
        </mee-card>
      </mee-radio-group>
    </app-doc-code>
  `,
})
export default class RadioComponent {
  radioValue = '1';

  tsCode = `
  import { Component } from '@angular/core';
  import { RadioGroup, Radio } from '@meeui/ui/radio';
  import { FormsModule } from '@angular/forms';

  @Component({
    selector: 'app-root',
    imports: [RadioGroup, Radio, FormsModule],
    template: \`
      <mee-radio-group [(ngModel)]="radioValue">
        <mee-radio value="1">Radio 1</mee-radio>
        <mee-radio value="2">Radio 2</mee-radio>
        <mee-radio value="3" [disabled]="true">Radio 3</mee-radio>
      </mee-radio-group>
    \`
  })
  export class AppComponent {
    radioValue = '1';
  }
  `;
}
