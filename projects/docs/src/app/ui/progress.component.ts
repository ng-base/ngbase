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
      <button meeButton meeTooltip="increment" class="mr-2" (click)="increment()">+</button>
      <button meeButton meeTooltip="decrement" (click)="decrement()">-</button>
      <mee-progress [value]="percentage" class="w-96"></mee-progress>
    </app-doc-code>
  `,
})
export class ProgressComponent {
  percentage = 50;

  increment() {
    this.percentage = Math.min(this.percentage + 10, 100);
  }

  decrement() {
    this.percentage = Math.max(this.percentage - 10, 0);
  }

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
