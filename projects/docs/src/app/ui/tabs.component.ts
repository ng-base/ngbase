import { Component, signal } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { Tab, TabHeader, TabLazy, Tabs } from '@meeui/ui/tabs';
import { Heading } from '@meeui/ui/typography';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideX } from '@ng-icons/lucide';
import { DocCode } from './code.component';

@Component({
  selector: 'app-tab-lazy',
  template: `<p>Lazy tab</p>`,
})
export class TabLazyComponent {
  constructor() {
    console.log('lazy tab');
  }
}

@Component({
  selector: 'app-tabs',
  imports: [Tabs, Tab, TabLazy, TabHeader, Heading, DocCode, Icon, Button, TabLazyComponent],
  viewProviders: [provideIcons({ lucidePlus, lucideX })],
  template: `
    <h4 meeHeader class="mb-5" id="tabsPage">Tabs</h4>

    <app-doc-code [tsCode]="tsCode">
      <mee-tabs
        [(selectedIndex)]="tabIndex"
        (selectedIndexChange)="tabIndexChange($event)"
        class="w-[40rem] max-w-full overflow-hidden rounded-base border shadow-sm"
      >
        <div
          class="tab-start-header-content flex items-center justify-center whitespace-nowrap px-b4"
        >
          <h4 class="text-base font-semibold">Tab Header</h4>
        </div>
        <div class="tab-header-content flex items-center justify-center">
          <button meeButton variant="ghost" class="mr-2 h-8 w-8" (click)="addTab()">
            <mee-icon name="lucidePlus" />
          </button>
        </div>
        @for (n of tabs(); track n.id) {
          <mee-tab [title]="n.name" class="p-b4" [disabled]="n.disabled">
            <div *meeTabHeader class="flex h-full items-center whitespace-nowrap">
              {{ n.name }}

              <div
                meeButton
                variant="ghost"
                tabindex="-1"
                class="ml-2 h-7 w-7 !p-b"
                (click)="deleteTab(n.id)"
              >
                <mee-icon name="lucideX" />
              </div>
            </div>
            <p>
              Tab {{ $index }} <br />
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis, rerum? Quidem
              doloremque sit omnis! Blanditiis dolorem exercitationem obcaecati, necessitatibus
              voluptatibus maxime! Est ipsa ratione, vel quae iusto facilis id quisquam.
            </p>
          </mee-tab>
        }
        <mee-tab mode="lazy">
          <app-tab-lazy *meeTabLazy></app-tab-lazy>
        </mee-tab>
      </mee-tabs>
    </app-doc-code>
  `,
})
export class TabsComponent {
  tabs = signal([
    { id: 0, name: 'Tab 1' },
    { id: 1, name: 'Tab with long name 2', disabled: true },
  ]);
  tabIndex = signal<number>(undefined as any);
  tsCode = `
  import { Component } from '@angular/core';
  import { Tabs, Tab, TabHeader } from '@meeui/ui/tabs';

  @Component({
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

  tabIndexChange(index: number) {
    console.log(index);
  }
}
