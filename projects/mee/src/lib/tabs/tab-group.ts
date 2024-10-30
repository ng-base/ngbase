import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  contentChildren,
  effect,
  input,
  model,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';
import { Tab } from './tab';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { Icon } from '../icon';
import { AccessibleGroup, AccessibleItem } from '../a11y';
import { uniqueId } from '../utils';

export interface TabChangeEvent {
  tab: Tab;
  index: number;
}

@Component({
  standalone: true,
  selector: 'mee-tabs',
  imports: [NgTemplateOutlet, Icon, NgClass, AccessibleGroup, AccessibleItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
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
        <nav role="tablist" #tabList class="tabList overflow-auto" meeAccessibleGroup [ayId]="ayId">
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
  styles: `
    .tabList {
      scrollbar-width: none;
    }
  `,
  host: {
    class: 'bg-foreground flex flex-col',
  },
})
export class Tabs {
  readonly tabList = viewChild.required<ElementRef<HTMLElement>>('tabList');
  readonly tabListContainer = viewChild.required<ElementRef<HTMLElement>>('tabListContainer');
  readonly tabButtons = viewChildren<ElementRef<HTMLElement>>('tabButtons');
  readonly leftScroll = viewChild<ElementRef<HTMLElement>>('leftScroll');
  readonly rightScroll = viewChild<ElementRef<HTMLElement>>('rightScroll');
  readonly tabs = contentChildren(Tab);

  readonly selectedIndex = model<any>(0);
  readonly selectedTabChange = output<TabChangeEvent>();
  readonly headerStyle = input(true, { transform: booleanAttribute });

  private selectedId?: number;
  private readonly tabMap = new Map<number, string>();
  readonly ayId = uniqueId();

  constructor() {
    effect(cleanup => {
      const tabList = this.tabList().nativeElement;
      const tabListContainer = this.tabListContainer().nativeElement;
      if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(() => {
          this.updateScrollDisplay(tabList);
        });
        observer.observe(tabListContainer);
        cleanup(() => observer.disconnect());
      }
    });

    effect(() => {
      const tabs = this.tabs();
      tabs.forEach((tab, index) => tab.index.set(index));
    });

    effect(() => {
      const tabs = this.tabs();
      let activeIndex = this.selectedIndex();
      if (activeIndex === undefined || activeIndex === null) {
        this.setActive(tabs[0]);
        return;
      }
      if (this.selectedId !== undefined && activeIndex === this.selectedId) {
        const id = this.tabMap.get(this.selectedId);
        const tab = tabs.find(tab => tab.id === id);
        if (tab && activeIndex !== tab.index()) {
          this.setActive(tab);
          this.selectedId = undefined;
          return;
        }
      }

      // make sure the index is not a disabled tab
      // if (tabs[activeIndex]?.disabled()) {
      //   const nextIndex = tabs.findIndex((tab, index) => !tab.disabled() && index > activeIndex);
      //   activeIndex = nextIndex === -1 ? tabs.length - 1 : nextIndex;
      //   this.selectedIndex.set(activeIndex);
      //   this.selectedId = activeIndex;
      //   return;
      // }

      // tabMap is used to keep track of the tab headers
      this.tabMap.clear();
      let activeTab: Tab;
      tabs.forEach((tab, index) => {
        tab.active.set(activeIndex === tab.tabId());
        if (activeIndex === tab.tabId()) {
          activeTab = tab;
        }
        this.tabMap.set(index, tab.id);
      });

      this.selectedId = activeIndex;

      // scroll to the active tab
      this.scrollToActive(activeTab!.index());
    });

    afterNextRender(() => {
      const el = this.tabList().nativeElement;
      this.updateScrollDisplay(el);
      el.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
          this.updateScrollDisplay(el);
        });
      });
    });
  }

  private updateScrollDisplay(el: HTMLElement) {
    const leftScroll = this.leftScroll()!.nativeElement;
    const rightScroll = this.rightScroll()!.nativeElement;
    leftScroll.style.display = el.scrollLeft > 0 ? 'grid' : 'none';
    rightScroll.style.display = el.scrollLeft + el.clientWidth < el.scrollWidth ? 'grid' : 'none';
  }

  scroll(direction: 'left' | 'right') {
    const tabList = this.tabList()!.nativeElement;
    const el = this.tabList()!.nativeElement;
    const scroll = el.clientWidth * 0.8;
    const isLeft = direction === 'left';
    tabList.scrollTo({
      left: tabList.scrollLeft + (isLeft ? -scroll : scroll),
      behavior: 'smooth',
    });
  }

  setActive(tab: Tab) {
    this.selectedIndex.set(tab.tabId());
    this.scrollToActive(tab.index());
    this.selectedTabChange.emit({ tab, index: tab.index() });
  }

  private scrollToActive(index: number) {
    const tabList = this.tabList().nativeElement;
    const tabs = this.tabButtons().slice(0, index + 1);
    // ssr does not support getBoundingClientRect
    const totalWidth = tabs.reduce((a, c) => {
      const width = c.nativeElement.getBoundingClientRect?.().width || 0;
      return a + width;
    }, 0);

    const { width } = tabList.getBoundingClientRect?.() || { width: 0 };
    const scrollLeft = tabList.scrollLeft;
    const lastTab = tabs[tabs.length - 1]?.nativeElement;
    const lastTabWidth = lastTab?.getBoundingClientRect?.().width || 0;
    const withoutLastTabWidth = totalWidth - lastTabWidth;

    const isLeftSide = scrollLeft + width / 2 > withoutLastTabWidth + lastTabWidth / 2;
    const left = isLeftSide ? totalWidth - lastTabWidth : totalWidth - width;

    if (withoutLastTabWidth < scrollLeft || totalWidth > scrollLeft + width) {
      tabList.scrollTo({ left, behavior: 'smooth' });
    }
  }
}
