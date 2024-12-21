import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleGroup, ToggleItem } from '@meeui/ui/toggle-group';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-toggle-group',
  imports: [FormsModule, Heading, ToggleGroup, ToggleItem, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="toggleGroupPage">Toggle Group</h4>
    <app-doc-code [tsCode]="code">
      <mee-toggle-group [(ngModel)]="toggleGroup">
        <button meeToggleItem value="A">A</button>
        <button meeToggleItem value="B">B</button>
        <button meeToggleItem value="C">C</button>
      </mee-toggle-group>
    </app-doc-code>
  `,
})
export default class ToggleGroupComponent {
  toggleGroup = ['A'];

  code = `
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { ToggleGroup, ToggleItem } from '@meeui/ui/toggle-group';

  @Component({
    selector: 'app-toggle-group',
    imports: [FormsModule, ToggleGroup, ToggleItem],
    template: \`
      <mee-toggle-group [(ngModel)]="value">
        <button meeToggleItem value="A">A</button>
        <button meeToggleItem value="B">B</button>
        <button meeToggleItem value="C">C</button>
      </mee-toggle-group>
    \`,
  })
  export class ToggleGroupComponent {
    value = 'A';
  }
  `;
}
