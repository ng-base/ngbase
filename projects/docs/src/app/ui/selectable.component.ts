import { Component, OnInit } from '@angular/core';
import { Tab, Tabs, TabHeader } from '@meeui/tabs';
import { RangePipe } from '@meeui/utils';
import { Heading } from '@meeui/typography';
import { Selectable, SelectableItem } from '@meeui/selectable';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-tabs',
  imports: [Tabs, Tab, TabHeader, Heading, RangePipe, Selectable, SelectableItem, DocCode],
  template: `
    <h4 meeHeader class="mb-5 mt-8">Selectable</h4>

    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
      <mee-selectable [activeIndex]="0">
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
  htmlCode = `
  <mee-selectable [activeIndex]="0">
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
  `;

  tsCode = `
  import { Component } from '@angular/core';
  import { Selectable, SelectableItem } from '@meeui/selectable';

  @Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [Selectable, SelectableItem],
  })
  export class AppComponent { }
  `;
}
