import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Checkbox } from '@meeui/checkbox';
import { FormsModule } from '@angular/forms';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-checkbox',
  imports: [Heading, Checkbox, FormsModule, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="checkboxPage">Checkbox</h4>
    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
      <mee-checkbox class="w-full" [(ngModel)]="checkBox"> Check the UI </mee-checkbox>
      <mee-checkbox class="w-full">Check the UI</mee-checkbox>
      <mee-checkbox class="w-full" [checked]="true" [disabled]="true">Check the UI</mee-checkbox>
    </app-doc-code>
  `,
})
export class CheckboxComponent {
  checkBox = false;

  htmlCode = `
      <mee-checkbox [(ngModel)]="checkBox">Check the UI</mee-checkbox>
    `;

  tsCode = `
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { Checkbox } from '@meeui/checkbox';

  @Component({
    standalone: true,
    selector: 'app-root',
    template: \`${this.htmlCode}\`,
    imports: [Checkbox, FormsModule],
  })
  export class AppComponent {
    checkBox = false;
  }
  `;
}
