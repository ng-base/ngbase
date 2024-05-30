import { Component, OnInit } from '@angular/core';
import { Progress } from '@meeui/progress';
import { Button } from '@meeui/button';
import { Tooltip } from '@meeui/tooltip';
import { Heading } from '@meeui/typography';

@Component({
  standalone: true,
  selector: 'app-progress',
  imports: [Progress, Button, Tooltip, Heading],
  template: `
    <h4 meeHeader class="mb-5" id="progressPage">Progress</h4>
    <button
      meeButton
      meeTooltip="increment"
      class="mr-2"
      (click)="percentage = percentage + 10"
    >
      +
    </button>
    <button
      meeButton
      meeTooltip="decrement"
      (click)="percentage = percentage - 10"
    >
      -
    </button>
    <mee-progress [percentage]="percentage"></mee-progress>
  `,
})
export class ProgressComponent implements OnInit {
  percentage = 50;

  constructor() {}

  ngOnInit() {}
}
