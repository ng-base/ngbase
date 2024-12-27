import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  MeeTab,
  MeeTabHeader,
  MeeTabLazy,
  MeeTabs,
  provideTab,
  provideTabs,
  TabButton,
  TabButtonsGroup,
  TabScroll,
} from '@meeui/adk/tabs';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';

@Component({
  selector: 'mee-tabs',
  imports: [Icon, TabButton, TabButtonsGroup, TabScroll],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTabs(Tabs)],
  viewProviders: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
  template: `<div class="flex items-center border-b">
      <ng-content select=".tab-start-header-content" />
      <div class="relative flex overflow-hidden">
        <button
          meeTabScroll="left"
          class="absolute left-0 z-10 h-full place-items-center bg-foreground px-2"
        >
          <mee-icon name="lucideChevronLeft" />
        </button>
        <nav meeTabButtonsGroup class="overflow-auto">
          <div #tabListContainer class="flex h-full w-max">
            @for (tab of tabs(); track tab.id) {
              <button
                [meeTabButton]="tab"
                class="{{
                  'whitespace-nowrap border-b-2 border-transparent aria-[disabled=true]:cursor-not-allowed aria-[selected=true]:!border-primary aria-[disabled=true]:text-muted aria-[selected=true]:!text-primary aria-[disabled=true]:opacity-50' +
                    (headerStyle() ? ' px-b4 py-b3 font-medium text-muted' : '')
                }}"
              ></button>
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

@Component({
  selector: 'mee-tab',
  exportAs: 'meeTab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTab(Tab)],
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
    '[class]': `active() ? 'flex-1 h-full pt-b4' : 'hidden'`,
  },
})
export class Tab extends MeeTab {}

@Directive({
  selector: '[meeTabHeader]',
  hostDirectives: [MeeTabHeader],
})
export class TabHeader {}

@Directive({
  selector: '[meeTabLazy]',
  hostDirectives: [MeeTabLazy],
})
export class TabLazy {}
