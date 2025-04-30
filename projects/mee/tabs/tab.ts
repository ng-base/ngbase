import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import {
  aliasTab,
  aliasTabs,
  NgbTab,
  NgbTabChangeEvent,
  NgbTabHeader,
  NgbTabLazy,
  NgbTabs,
  TabButton,
  TabButtonsGroup,
  TabScroll,
} from '@ngbase/adk/tabs';

@Component({
  selector: 'mee-tabs',
  imports: [Icon, TabButton, TabButtonsGroup, TabScroll],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasTabs(Tabs)],
  viewProviders: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
  template: `<div class="flex items-center border-b">
      <ng-content select=".tab-start-header-content" />
      <div class="relative flex overflow-hidden">
        <button
          ngbTabScroll="left"
          class="absolute left-0 z-10 h-full place-items-center bg-background px-2"
        >
          <mee-icon name="lucideChevronLeft" />
        </button>
        <nav ngbTabButtonsGroup class="overflow-auto">
          <div #tabListContainer class="flex h-full w-max">
            @for (tab of tabs(); track tab.id) {
              <button
                [ngbTabButton]="tab"
                class="whitespace-nowrap border-b-2 border-transparent font-medium text-muted-foreground aria-[disabled=true]:cursor-not-allowed aria-[selected=true]:!border-primary aria-[disabled=true]:text-muted-foreground aria-[selected=true]:!text-primary aria-[disabled=true]:opacity-50 [&[data-ch='false']]:px-4 [&[data-ch='false']]:py-3 [&[data-ch='true']>*:first-child]:px-4 [&[data-ch='true']>*:first-child]:py-3"
              ></button>
            }
          </div>
        </nav>
        <button
          ngbTabScroll="right"
          class="absolute right-0 z-10 h-full place-items-center bg-background px-2"
        >
          <mee-icon name="lucideChevronRight" />
        </button>
      </div>
      <ng-content select=".tab-header-content" />
    </div>
    <ng-content /> `,
  host: {
    class: 'bg-background flex flex-col',
  },
})
export class Tabs extends NgbTabs<Tab> {}

@Component({
  selector: 'mee-tab',
  exportAs: 'meeTab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasTab(Tab)],
  imports: [NgTemplateOutlet],
  template: `
    @if (lazyTemplate(); as template) {
      <ng-container *ngTemplateOutlet="template" />
    } @else if (activeMode()) {
      <ng-content />
    }
  `,
  host: {
    class: 'block overflow-auto',
    '[class]': `active() ? 'flex-1 h-full pt-4' : 'hidden'`,
  },
})
export class Tab extends NgbTab {}

@Directive({
  selector: '[meeTabHeader]',
  hostDirectives: [NgbTabHeader],
})
export class TabHeader {}

@Directive({
  selector: '[meeTabLazy]',
  hostDirectives: [NgbTabLazy],
})
export class TabLazy {}

export type TabChangeEvent = NgbTabChangeEvent;
