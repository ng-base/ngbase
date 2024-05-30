import { Component, OnInit } from '@angular/core';
import { Spinner } from '@meeui/spinner';
import { Heading } from '@meeui/typography';

@Component({
  standalone: true,
  selector: 'app-spinner',
  imports: [Spinner, Heading],
  template: `
    <h4 meeHeader class="mb-5" id="spinnerPage">Spinner</h4>
    <mee-spinner></mee-spinner>
  `,
})
export class SpinnerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
