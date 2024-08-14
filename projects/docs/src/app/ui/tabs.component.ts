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
    <h4 meeHeader class="mb-5" id="tabsPage">Tabs</h4>

    <app-doc-code [tsCode]="tsCode">
      <mee-tabs [selectedIndex]="1" class="w-[40rem] overflow-hidden rounded-base border shadow-sm">
        @for (n of 10 | range; track n) {
          <mee-tab [title]="'Tab with long name ' + n" class="p-b4">
            <p *meeTabHeader class="whitespace-nowrap">Tab with long name {{ n }}</p>
            <p>
              Tab {{ n }} <br />
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis, rerum? Quidem
              doloremque sit omnis! Blanditiis dolorem exercitationem obcaecati, necessitatibus
              voluptatibus maxime! Est ipsa ratione, vel quae iusto facilis id quisquam.
            </p>
          </mee-tab>
        }
      </mee-tabs>
    </app-doc-code>
  `,
})
export class TabsComponent {
  tsCode = `
  import { Component } from '@angular/core';
  import { Tabs, Tab, TabHeader } from '@meeui/tabs';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [Tabs, Tab, TabHeader],
    template: \`
      <mee-tabs [selectedIndex]="1">
        <mee-tab title="Tab 1">
          <p> This is a tab content </p>
        </mee-tab>
        <mee-tab>
          <p *meeTabHeader class="whitespace-nowrap">Tab with long name</p>
          <p> This is a tab content </p>
        </mee-tab>
      </mee-tabs>
    \`
  })
  export class AppComponent { }
  `;
}
