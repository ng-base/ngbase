import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { List, ListSelection } from '@meeui/list';
import { Heading } from '@meeui/typography';
import { Option } from '@meeui/select';

@Component({
  standalone: true,
  selector: 'app-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [List, Option, ListSelection, Heading],
  template: `
    <h4 meeHeading class="mb-b5">Simple List</h4>
    <mee-list>Option 1</mee-list>
    <mee-list>Option 2</mee-list>
    <mee-list>Option 3</mee-list>
    <h4 meeHeading class="my-b5">Multi List</h4>
    <mee-list-selection multiple>
      <mee-option [value]="1">Option 1</mee-option>
      <mee-option [value]="2">Option 2</mee-option>
      <mee-option [value]="3">Option 3</mee-option>
    </mee-list-selection>
  `,
})
export class ListComponent {}
