import { Component, OnInit } from '@angular/core';
import { Tab, Tabs, TabHeader } from '@meeui/tabs';
import { RangePipe } from '@meeui/utils';
import { Heading } from '@meeui/typography';
import { Selectable, SelectableItem } from '@meeui/selectable';

@Component({
  standalone: true,
  selector: 'app-tabs',
  imports: [Tabs, Tab, TabHeader, Heading, RangePipe, Selectable, SelectableItem],
  template: `
    <h4 meeHeader class="mb-5" id="tabsPage">Tabs</h4>
    <mee-tabs [selectedIndex]="1">
      @for (n of 10 | range; track n) {
        <mee-tab [title]="'Tab with long name ' + n">
          <p *meeTabHeader class="whitespace-nowrap">Tab with long name {{ n }}</p>
          <p>
            Tab {{ n }} Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis, rerum?
            Quidem doloremque sit omnis! Blanditiis dolorem exercitationem obcaecati, necessitatibus
            voluptatibus maxime! Est ipsa ratione, vel quae iusto facilis id quisquam.
          </p>
        </mee-tab>
      }
    </mee-tabs>

    <h4 meeHeader class="mb-5 mt-8">Selectable</h4>
    <mee-selectable>
      @for (n of 3 | range; track n) {
        <mee-selectable-item [value]="$index">
          <p class="whitespace nowrap">item {{ n }}</p>
        </mee-selectable-item>
      }
    </mee-selectable>
  `,
})
export class TabsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
