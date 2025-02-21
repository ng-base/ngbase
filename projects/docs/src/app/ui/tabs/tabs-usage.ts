import { Component } from '@angular/core';
import { Tabs, Tab, TabHeader } from '@meeui/ui/tabs';

@Component({
  selector: 'app-root',
  imports: [Tabs, Tab, TabHeader],
  template: `
    <mee-tabs [selectedIndex]="1">
      <mee-tab title="Tab 1">
        <p>This is a tab content</p>
      </mee-tab>
      <mee-tab>
        <p *meeTabHeader class="whitespace-nowrap">Tab with long name</p>
        <p>This is a tab content</p>
      </mee-tab>
    </mee-tabs>
  `,
})
export class AppComponent {}
