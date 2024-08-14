import { ChangeDetectionStrategy, Component } from '@angular/core';
import { List } from '@meeui/list';
import { Heading } from '@meeui/typography';
import { Option, ListSelection } from '@meeui/select';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [List, Option, ListSelection, Heading, DocCode],
  template: `
    <h4 meeHeading class="mb-b5">Simple List</h4>

    <app-doc-code [tsCode]="code">
      <mee-list>Option 1</mee-list>
      <mee-list>Option 2</mee-list>
      <mee-list>Option 3</mee-list>

      <h4 meeHeading class="my-b5">Multi List</h4>
      <mee-list-selection multiple>
        <mee-option [value]="1">Option 1</mee-option>
        <mee-option [value]="2">Option 2</mee-option>
        <mee-option [value]="3">Option 3</mee-option>
      </mee-list-selection>
    </app-doc-code>
  `,
})
export class ListComponent {
  code = `
  import { Component } from '@angular/core';
  import { List } from '@meeui/list';
  import { Option, ListSelection } from '@meeui/select';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [List, Option, ListSelection],
    template: \`
      <mee-list>Option 1</mee-list>
      <mee-list>Option 2</mee-list>
      <mee-list>Option 3</mee-list>

      <mee-list-selection multiple>
        <mee-option [value]="1">Option 1</mee-option>
        <mee-option [value]="2">Option 2</mee-option>
        <mee-option [value]="3">Option 3</mee-option>
      </mee-list-selection>
    \`,
  })
  export class AppComponent {}
  `;
}
