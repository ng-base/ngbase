import { Component, signal } from '@angular/core';
import { Spinner } from '@meeui/ui/spinner';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-spinner',
  imports: [Spinner, Heading, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="spinnerPage">Spinner</h4>
    <app-doc-code [tsCode]="tsCode">
      @if (showRoot()) {
        <mee-spinner>Loading...</mee-spinner>
      }
    </app-doc-code>
    <!-- @if (showRoot()) {
      <mee-spinner [root]="true" />
    } -->
  `,
})
export default class SpinnerComponent {
  tsCode = `
  import { Component } from '@angular/core';
  import { Spinner } from '@meeui/ui/spinner';

  @Component({
    selector: 'app-root',
    imports: [Spinner],
    template: \`
      <mee-spinner />
    \`
  })
  export class AppComponent { }
  `;

  showRoot = signal(true);

  constructor() {
    // toggle root mode every 2 seconds
    // setInterval(() => {
    //   this.showRoot.update(showRoot => !showRoot);
    // }, 2000);
  }
}
