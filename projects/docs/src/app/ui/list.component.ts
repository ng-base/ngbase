import { ChangeDetectionStrategy, Component } from '@angular/core';
import { List } from '@meeui/ui/list';
import { ListSelection, Option } from '@meeui/ui/select';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [List, Option, ListSelection, Heading, DocCode],
  template: `
    <h4 meeHeader class="mb-5">Simple List</h4>

    <app-doc-code [tsCode]="code">
      <button meeList>Option 1</button>
      <button meeList>Option 2</button>
      <button meeList>Option 3</button>

      <h4 meeHeader class="my-5">Multi List</h4>
      <mee-list-selection multiple>
        <mee-option [value]="1">Option 1</mee-option>
        <mee-option [value]="2">Option 2</mee-option>
        <mee-option [value]="3">Option 3</mee-option>
      </mee-list-selection>
    </app-doc-code>
  `,
})
export default class ListComponent {
  code = `
  import { Component } from '@angular/core';
  import { List } from '@meeui/ui/list';
  import { Option, ListSelection } from '@meeui/ui/select';

  @Component({
    selector: 'app-root',
    imports: [List, Option, ListSelection],
    template: \`
      <button meeList>Option 1</button>
      <button meeList>Option 2</button>
      <button meeList>Option 3</button>

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
