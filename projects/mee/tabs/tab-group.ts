import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccessibleGroup, AccessibleItem } from '@meeui/adk/a11y';
import { MeeTabs } from '@meeui/adk/tabs';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { Tab } from './tab';

export interface TabChangeEvent {
  tab: Tab;
  index: number;
}

@Component({
  selector: 'mee-tabs',
  imports: [NgTemplateOutlet, Icon, NgClass, AccessibleGroup, AccessibleItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MeeTabs, useExisting: Tabs },
    provideIcons({ lucideChevronRight, lucideChevronLeft }),
  ],
  template: `<div class="flex items-center border-b">
      <ng-content select=".tab-start-header-content" />
      <div class="relative flex overflow-hidden" role="tabList">
        <button
          #leftScroll
          type="button"
          (click)="scroll('left')"
          class="absolute left-0 z-10 hidden h-full place-items-center bg-foreground px-2"
          tabindex="-1"
        >
          <mee-icon name="lucideChevronLeft" />
        </button>
        <nav
          role="tablist"
          #tabList
          class="overflow-auto [scrollbar-width:none]"
          meeAccessibleGroup
          [ayId]="ayId"
        >
          <div #tabListContainer class="flex h-full w-max">
            @for (tab of tabs(); track tab.id) {
              <button
                #tabButtons
                type="button"
                class="whitespace-nowrap border-b-2 border-transparent"
                [ngClass]="{
                  'cursor-not-allowed text-muted opacity-50': tab.disabled(),
                  '!border-primary !text-primary': tab.tabId() === selectedIndex(),
                }"
                (click)="!tab.disabled() && setActive(tab)"
                role="tab"
                [attr.aria-selected]="selectedIndex() === tab.tabId()"
                [attr.id]="tab.id"
                [disabled]="tab.disabled()"
                meeAccessibleItem
                [ayId]="ayId"
              >
                <div
                  [ngClass]="{
                    'px-b4 py-b3 font-medium text-muted': headerStyle(),
                    '!text-primary': tab.tabId() === selectedIndex(),
                  }"
                >
                  @if (tab.header()) {
                    <ng-container *ngTemplateOutlet="tab.header()!" />
                  } @else {
                    {{ tab.label() }}
                  }
                </div>
              </button>
            }
          </div>
        </nav>
        <button
          #rightScroll
          type="button"
          (click)="scroll('right')"
          class="absolute right-0 z-10 hidden h-full place-items-center bg-foreground px-2"
          tabindex="-1"
        >
          <mee-icon name="lucideChevronRight" />
        </button>
      </div>
      <ng-content select=".tab-header-content" />
    </div>
    <ng-content /> `,
  host: {
    class: 'bg-foreground flex flex-col',
  },
})
export class Tabs extends MeeTabs {}
