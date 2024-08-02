import { Component, OnInit } from '@angular/core';
import { Progress } from '@meeui/progress';
import { Button } from '@meeui/button';
import { Tooltip } from '@meeui/tooltip';
import { Heading } from '@meeui/typography';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-progress',
  imports: [Progress, Button, Tooltip, Heading, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="progressPage">Progress</h4>
    <app-doc-code [tsCode]="tsCode">
      <button meeButton meeTooltip="increment" class="mr-2" (click)="percentage = percentage + 10">
        +
      </button>
      <button meeButton meeTooltip="decrement" (click)="percentage = percentage - 10">-</button>
      <mee-progress [value]="percentage" class="w-96"></mee-progress>
    </app-doc-code>
  `,
})
export class ProgressComponent {
  percentage = 50;

  tsCode = `
  import { Component } from '@angular/core';
  import { Progress } from '@meeui/progress';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [Progress],
    template: \`
      <mee-progress [value]="percentage"></mee-progress>
    \`
  })
  export class AppComponent {
    percentage = 50;
  }
  `;
}
