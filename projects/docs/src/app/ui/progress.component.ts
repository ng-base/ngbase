import { Component } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Progress } from '@meeui/ui/progress';
import { Tooltip } from '@meeui/ui/tooltip';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-progress',
  imports: [Progress, Button, Tooltip, Heading, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="progressPage">Progress</h4>
    <app-doc-code [tsCode]="tsCode" [adkCode]="adkCode">
      <div class="flex items-center gap-2">
        <button meeButton meeTooltip="decrement" (click)="decrement()">-</button>
        <button meeButton meeTooltip="increment" (click)="increment()">+</button>
      </div>
      <mee-progress [value]="percentage" class="w-96" />
    </app-doc-code>
  `,
})
export default class ProgressComponent {
  percentage = 50;

  increment() {
    this.percentage = Math.min(this.percentage + 10, 100);
  }

  decrement() {
    this.percentage = Math.max(this.percentage - 10, 0);
  }

  tsCode = `
  import { Component } from '@angular/core';
  import { Progress } from '@meeui/ui/progress';

  @Component({
    selector: 'app-root',
    imports: [Progress],
    template: \`
      <mee-progress [value]="percentage" />
    \`
  })
  export class AppComponent {
    percentage = 50;
  }
  `;

  adkCode = `
  import { ChangeDetectionStrategy, Component } from '@angular/core';
  import { MeeProgress, MeeProgressBar } from '@meeui/adk/progress';

  @Component({
    selector: 'mee-progress',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [{ directive: MeeProgress, inputs: ['value'] }],
    imports: [MeeProgressBar],
    template: \`<div class="h-full bg-primary transition" meeProgressBar></div>\`,
    host: {
      class: 'block h-2 my-1 bg-background rounded-full',
    },
  })
  export class Progress {}
  `;
}
