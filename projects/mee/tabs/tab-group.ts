import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeTabs, TabButton, TabButtonsGroup, TabScroll } from '@meeui/adk/tabs';
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
  imports: [NgTemplateOutlet, Icon, NgClass, TabButton, TabButtonsGroup, TabScroll],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MeeTabs, useExisting: Tabs },
    provideIcons({ lucideChevronRight, lucideChevronLeft }),
  ],
  template: `<div class="flex items-center border-b">
      <ng-content select=".tab-start-header-content" />
      <div class="relative flex overflow-hidden">
        <button
          meeTabScroll="left"
          class="absolute left-0 z-10 h-full place-items-center bg-foreground px-2"
        >
          <mee-icon name="lucideChevronLeft" />
        </button>
        <nav meeTabButtonsGroup class="overflow-auto [scrollbar-width:none]">
          <div #tabListContainer class="flex h-full w-max">
            @for (tab of tabs(); track tab.id) {
              <button
                #tabButtons
                [meeTabButton]="tab"
                class="whitespace-nowrap border-b-2 border-transparent aria-[disabled=true]:cursor-not-allowed aria-[selected=true]:!border-primary aria-[disabled=true]:text-muted aria-[selected=true]:!text-primary aria-[disabled=true]:opacity-50"
                [ngClass]="{
                  'px-b4 py-b3 font-medium text-muted': headerStyle(),
                }"
              >
                @if (tab.header()) {
                  <ng-container *ngTemplateOutlet="tab.header()!" />
                } @else {
                  {{ tab.label() }}
                }
              </button>
            }
          </div>
        </nav>
        <button
          meeTabScroll="right"
          class="absolute right-0 z-10 h-full place-items-center bg-foreground px-2"
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
