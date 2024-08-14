import { Component, OnInit } from '@angular/core';
import { Spinner } from '@meeui/spinner';
import { Heading } from '@meeui/typography';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-spinner',
  imports: [Spinner, Heading, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="spinnerPage">Spinner</h4>
    <app-doc-code [tsCode]="tsCode">
      <mee-spinner />
    </app-doc-code>
  `,
})
export class SpinnerComponent {
  tsCode = `
  import { Component } from '@angular/core';
  import { Spinner } from '@meeui/spinner';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [Spinner],
    template: \`
      <mee-spinner></mee-spinner>
    \`
  })
  export class AppComponent { }
  `;
}
