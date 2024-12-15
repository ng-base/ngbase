import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';
import { AccessibleGroup, AccessibleItem } from '@meeui/adk/a11y';
import { uniqueId } from '@meeui/adk/utils';
import { MeeTab } from './tab';

export interface TabChangeEvent {
  tab: MeeTab;
  index: number;
}

@Directive({
  selector: '[meeTabButtonsGroup]',
  hostDirectives: [{ directive: AccessibleGroup }],
  host: {
    role: 'tablist',
  },
})
export class TabButtonsGroup {
  private readonly tabGroup = inject(MeeTabs);
  private readonly accessibleGroup = inject(AccessibleGroup);

  constructor() {
    this.accessibleGroup.ayId.set(this.tabGroup.ayId);
  }
}

@Directive({
  selector: 'button[meeTabButton]',
  hostDirectives: [{ directive: AccessibleItem }],
  host: {
    type: 'button',
    role: 'tab',
    '[attr.id]': 'meeTabButton().id',
    '(click)': '!meeTabButton().disabled() && tabGroup.setActive(meeTabButton())',
  },
})
export class TabButton {
  private readonly tabGroup = inject(MeeTabs);
  private readonly accessibleItem = inject(AccessibleItem);

  readonly meeTabButton = input.required<MeeTab>();

  constructor() {
    this.accessibleItem._selected = computed(
      () => this.meeTabButton().tabId() === this.tabGroup.selectedIndex(),
    );
    this.accessibleItem._disabled = computed(() => this.meeTabButton().disabled());
    this.accessibleItem._ayId.set(this.tabGroup.ayId);
  }
}

@Directive({
  selector: 'button[meeTabScroll]',
  host: {
    type: 'button',
    tabindex: '-1',
    style: '{display: none}',
    '(click)': 'tabGroup.scroll(meeTabScroll())',
  },
})
export class TabScroll {
  readonly meeTabScroll = input.required<'left' | 'right'>();
  readonly tabGroup = inject(MeeTabs);
}

@Component({
  selector: 'mee-tabs',
  exportAs: 'meeTabs',
  imports: [NgTemplateOutlet, NgClass, TabButton, TabButtonsGroup, TabScroll],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="flex items-center border-b">
      <ng-content select=".tab-start-header-content" />
      <div class="relative flex overflow-hidden">
        <button
          meeTabScroll="left"
          class="absolute left-0 z-10 h-full place-items-center bg-foreground px-2"
        >
          <
        </button>
        <nav meeTabButtonsGroup class="overflow-auto [scrollbar-width:none]">
          <div #tabListContainer class="flex h-full w-max">
            @for (tab of tabs(); track tab.id) {
              <button
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
export class MeeTabs {
  readonly tabList = viewChild.required<TabButtonsGroup, ElementRef<HTMLElement>>(TabButtonsGroup, {
    read: ElementRef,
  });
  readonly tabListContainer = viewChild.required<ElementRef<HTMLElement>>('tabListContainer');
  readonly tabButtons = viewChildren<TabButton, ElementRef<HTMLElement>>(TabButton, {
    read: ElementRef,
  });
  // readonly leftScroll = viewChild<ElementRef<HTMLElement>>('leftScroll');
  // readonly rightScroll = viewChild<ElementRef<HTMLElement>>('rightScroll');
  readonly scrollButtons = viewChildren<TabScroll, ElementRef<HTMLElement>>(TabScroll, {
    read: ElementRef,
  });
  readonly tabs = contentChildren(MeeTab);

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
      } else if (activeIndex >= tabs.length) {
        // if the index is out of bounds, set the last tab as active
        this.setActive(tabs[tabs.length - 1]);
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
      let activeTab: MeeTab;
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
    const leftScroll = this.scrollButtons()[0]!.nativeElement;
    const rightScroll = this.scrollButtons()[1]!.nativeElement;
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

  setActive(tab: MeeTab) {
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
