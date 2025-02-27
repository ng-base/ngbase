import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  aliasTab,
  aliasTabs,
  NgbTab,
  NgbTabHeader,
  NgbTabLazy,
  NgbTabs,
  TabButton,
  TabButtonsGroup,
  TabScroll,
} from '@ngbase/adk/tabs';

@Component({
  selector: 'mee-tabs',
  imports: [TabButton, TabButtonsGroup, TabScroll],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasTabs(Tabs)],
  template: `<div class="flex items-center border-b">
      <ng-content select=".tab-start-header-content" />
      <div class="relative flex overflow-hidden">
        <button
          ngbTabScroll="left"
          class="absolute left-0 z-10 h-full place-items-center bg-foreground px-2"
        >
          <
        </button>
        <nav ngbTabButtonsGroup class="overflow-auto">
          <div #tabListContainer class="flex h-full w-max">
            @for (tab of tabs(); track tab.id) {
              <button
                [ngbTabButton]="tab"
                class="whitespace-nowrap border-b-2 border-transparent aria-[disabled=true]:cursor-not-allowed aria-[selected=true]:!border-primary aria-[disabled=true]:text-muted aria-[selected=true]:!text-primary aria-[disabled=true]:opacity-50"
              ></button>
            }
          </div>
        </nav>
        <button
          ngbTabScroll="right"
          class="absolute right-0 z-10 h-full place-items-center bg-foreground px-2"
        >
          >
        </button>
      </div>
      <ng-content select=".tab-header-content" />
    </div>
    <ng-content /> `,
  host: {
    class: 'bg-foreground flex flex-col',
  },
})
export class Tabs extends NgbTabs {}

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
