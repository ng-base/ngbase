import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Checkbox } from '@meeui/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-checkbox',
  imports: [Heading, Checkbox, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="checkboxPage">Checkbox</h4>
    <mee-checkbox class="w-full" [(ngModel)]="checkBox">
      Check the UI
    </mee-checkbox>
    <mee-checkbox class="w-full">Check the UI</mee-checkbox>
  `,
})
export class CheckboxComponent {
  checkBox = false;
}
