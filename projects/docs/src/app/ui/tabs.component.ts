import { Component, OnInit, signal } from '@angular/core';
import { Tab, Tabs, TabHeader } from '@meeui/tabs';
import { RangePipe } from '@meeui/utils';
import { Heading } from '@meeui/typography';
import { Selectable, SelectableItem } from '@meeui/selectable';
import { DocCode } from './code.component';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideX } from '@ng-icons/lucide';
import { Icons } from '@meeui/icon';
import { Button } from '@meeui/button';

@Component({
  standalone: true,
  selector: 'app-tabs',
  imports: [
    Tabs,
    Tab,
    TabHeader,
    Heading,
    RangePipe,
    Selectable,
    SelectableItem,
    DocCode,
    Icons,
    Button,
  ],
  viewProviders: [provideIcons({ lucidePlus, lucideX })],
  template: `
    <h4 meeHeader class="mb-5" id="tabsPage">Tabs</h4>

    <app-doc-code [tsCode]="tsCode">
      <mee-tabs
        [(selectedIndex)]="tabIndex"
        class="w-[40rem] overflow-hidden rounded-base border shadow-sm"
      >
        <div
          class="tab-start-header-content flex items-center justify-center whitespace-nowrap px-b4"
        >
          <h4 class="text-base font-semibold">Tab Header</h4>
        </div>
        <div class="tab-header-content flex items-center justify-center">
          <button meeButton variant="ghost" class="mr-2 h-8 w-8" (click)="addTab()">
            <mee-icon name="lucidePlus"></mee-icon>
          </button>
        </div>
        @for (n of tabs(); track n.id) {
          <mee-tab [title]="n.name" class="p-b4" [disabled]="n.disabled">
            <div *meeTabHeader class="flex h-full items-center whitespace-nowrap px-4">
              {{ n.name }}

              <button meeButton variant="ghost" class="ml-2 h-7 w-7 !p-b" (click)="deleteTab(n.id)">
                <mee-icon name="lucideX" />
              </button>
            </div>
            <p>
              Tab {{ $index }} <br />
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
  tabs = signal([
    { id: 0, name: 'Tab 1' },
    { id: 1, name: 'Tab with long name 2', disabled: true },
  ]);
  tabIndex = signal(0);
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

  addTab() {
    this.tabs.update(tabs => [
      ...tabs,
      { id: tabs.length, name: `Tab with long name ${tabs.length}` },
    ]);
    // this.tabIndex.set(this.tabs().length - 1);
  }

  deleteTab(id: number) {
    this.tabs.update(tabs => tabs.filter(tab => tab.id !== id));
  }
}
