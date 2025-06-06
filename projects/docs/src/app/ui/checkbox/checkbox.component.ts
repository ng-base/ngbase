import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from '@meeui/ui/checkbox';
import { Heading } from '@meeui/ui/typography';
import { DocCode, getCode } from '../code.component';

@Component({
  selector: 'app-checkbox',
  imports: [Heading, Checkbox, FormsModule, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="checkboxPage">Checkbox</h4>
    <app-doc-code [tsCode]="tsCode()" [adkCode]="adkCode()">
      <div>
        <mee-checkbox class="w-full" [(ngModel)]="checkBox" [indeterminate]="indeterminate()">
          Check the UI
        </mee-checkbox>
        <mee-checkbox [(ngModel)]="indeterminate" />
      </div>
      <mee-checkbox class="w-full">Check the UI</mee-checkbox>
      <mee-checkbox class="w-full" [checked]="true" [disabled]="true">Check the UI</mee-checkbox>
    </app-doc-code>
  `,
})
export default class CheckboxComponent {
  checkBox = false;
  indeterminate = signal(false);

  tsCode = getCode('/checkbox/checkbox-usage.ts');

  adkCode = getCode('/checkbox/checkbox-adk.ts');
}
