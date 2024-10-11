import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Selectable, SelectableItem } from '@meeui/selectable';
import { Tab, TabHeader, Tabs } from '@meeui/tabs';
import { Heading } from '@meeui/typography';
import { RangePipe } from '@meeui/utils';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-tabs',
  imports: [
    FormsModule,
    Tabs,
    Tab,
    TabHeader,
    Heading,
    RangePipe,
    Selectable,
    SelectableItem,
    DocCode,
  ],
  template: `
    <h4 meeHeader class="mb-5 mt-8">Selectable</h4>

    <app-doc-code [tsCode]="tsCode">
      <mee-selectable [(ngModel)]="activeIndex">
        @for (n of 3 | range; track n) {
          <mee-selectable-item [value]="$index">
            <p class="whitespace nowrap">item {{ n }}</p>
          </mee-selectable-item>
        }
      </mee-selectable>
    </app-doc-code>
  `,
})
export class SelectableComponent {
  activeIndex = 2;

  tsCode = `
  import { Component } from '@angular/core';
  import { Selectable, SelectableItem } from '@meeui/selectable';

  @Component({
    standalone: true,
    selector: 'app-root',
    template: \`
      <mee-selectable [(activeIndex)]="index">
        <mee-selectable-item value="0">
          <p>item 1</p>
        </mee-selectable-item>
        <mee-selectable-item value="1">
          <p>item 2</p>
        </mee-selectable-item>
        <mee-selectable-item value="2">
          <p>item 3</p>
        </mee-selectable-item>
      </mee-selectable>
    \`,
    imports: [Selectable, SelectableItem],
  })
  export class AppComponent {
    index = 2;
  }
  `;
}
