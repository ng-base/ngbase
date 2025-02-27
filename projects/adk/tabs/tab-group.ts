import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  afterNextRender,
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
import { AccessibleGroup, AccessibleItem } from '@ngbase/adk/a11y';
import { uniqueId } from '@ngbase/adk/utils';
import { NgbTab } from './tab';

export interface TabChangeEvent {
  tab: NgbTab;
  index: number;
}

@Directive({
  selector: '[ngbTabButtonsGroup]',
  hostDirectives: [AccessibleGroup],
  host: {
    role: 'tablist',
    style: 'scrollbar-width: none',
  },
})
export class TabButtonsGroup {
  private readonly tabGroup = inject(NgbTabs);
  private readonly accessibleGroup = inject(AccessibleGroup);

  constructor() {
    this.accessibleGroup.ayId.set(this.tabGroup.ayId);
  }
}

@Component({
  selector: 'button[ngbTabButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [AccessibleItem],
  imports: [NgTemplateOutlet],
  template: `
    @if (ngbTabButton().header(); as template) {
      <ng-container *ngTemplateOutlet="template" />
    } @else {
      {{ ngbTabButton().label() }}
    }
  `,
  host: {
    type: 'button',
    role: 'tab',
    '[attr.id]': 'ngbTabButton().id',
    '(click)': '!ngbTabButton().disabled() && tabGroup.setActive(ngbTabButton())',
  },
})
export class TabButton {
  private readonly tabGroup = inject(NgbTabs);
  private readonly accessibleItem = inject(AccessibleItem);

  readonly ngbTabButton = input.required<NgbTab>();

  constructor() {
    this.accessibleItem._selected = computed(
      () => this.ngbTabButton().tabId() === this.tabGroup.selectedIndex(),
    );
    this.accessibleItem._disabled = computed(() => this.ngbTabButton().disabled());
    this.accessibleItem._ayId.set(this.tabGroup.ayId);
  }
}

@Directive({
  selector: 'button[ngbTabScroll]',
  host: {
    type: 'button',
    tabindex: '-1',
    style: '{display: none}',
    '(click)': 'tabGroup.scroll(ngbTabScroll())',
  },
})
export class TabScroll {
  readonly ngbTabScroll = input.required<'left' | 'right'>();
  readonly tabGroup = inject(NgbTabs);
}

@Directive({
  selector: 'ngb-tabs',
  exportAs: 'ngbTabs',
})
export class NgbTabs<T extends NgbTab = NgbTab> {
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
  readonly tabs = contentChildren<T>(NgbTab as any);

  readonly selectedIndex = model<any>(0);
  readonly selectedTabChange = output<TabChangeEvent>();

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
      let activeTab: NgbTab;
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

  setActive(tab: NgbTab) {
    // if the tab is not found, return
    if (!tab) return;

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

export function aliasTabs<T extends NgbTab>(tab: typeof NgbTabs<T>) {
  return {
    provide: NgbTabs,
    useExisting: tab,
  };
}
