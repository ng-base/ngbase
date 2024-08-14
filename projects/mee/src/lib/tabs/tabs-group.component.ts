import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  contentChildren,
  effect,
  model,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';
import { Tab } from './tabs.component';
import { NgClass, NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { Icons } from '../icon';
import { AccessibleGroup, AccessibleItem } from '../a11y';
import { generateId } from '../utils';

@Component({
  selector: 'mee-tabs',
  standalone: true,
  imports: [NgComponentOutlet, NgTemplateOutlet, Icons, NgClass, AccessibleGroup, AccessibleItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
  template: `<div class="flex border-b">
      <ng-content select=".tab-start-header-content"></ng-content>
      <div class="relative flex overflow-hidden" role="tabList">
        <button
          #leftScroll
          (click)="scroll('left')"
          class="absolute left-0 grid h-full place-items-center bg-foreground px-2"
        >
          <mee-icon name="lucideChevronLeft"></mee-icon>
        </button>
        <nav role="tablist" #tabList class="tabList overflow-auto" meeAccessibleGroup [ayId]="ayId">
          <div #tabListContainer class="flex h-full w-max">
            @for (tab of tabs(); track tab.id) {
              <button
                #tab
                class="whitespace-nowrap border-b-2 border-transparent"
                [ngClass]="{
                  'cursor-not-allowed text-muted text-opacity-80': tab.disabled(),
                  '!border-primary !text-text': $index === selectedIndex(),
                }"
                (click)="setActive($index)"
                role="tab"
                [tabindex]="$index === selectedIndex() ? 0 : -1"
                [attr.aria-selected]="selectedIndex() === $index"
                [id]="tab.id"
                [disabled]="tab.disabled()"
                meeAccessibleItem
                [ayId]="ayId"
              >
                @if (tab.header()) {
                  <ng-container *ngTemplateOutlet="tab.header()!"></ng-container>
                } @else {
                  <div class="px-b4 py-b3 font-medium text-muted">{{ tab.label() }}</div>
                }
              </button>
            }
          </div>
        </nav>
        <button
          #rightScroll
          (click)="scroll('right')"
          class="absolute right-0 grid h-full place-items-center bg-foreground px-2"
        >
          <mee-icon name="lucideChevronRight"></mee-icon>
        </button>
      </div>
      <ng-content select=".tab-header-content"></ng-content>
    </div>
    <ng-content></ng-content> `,
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
  readonly tab = viewChildren<ElementRef<HTMLElement>>('tab');
  readonly leftScroll = viewChild<ElementRef<HTMLElement>>('leftScroll');
  readonly rightScroll = viewChild<ElementRef<HTMLElement>>('rightScroll');
  readonly tabs = contentChildren(Tab);
  readonly selectedIndex = model(0);
  private selectedId?: number;
  readonly selectedTabChange = output<number>();
  private readonly tabMap = new Map<number, string>();
  readonly ayId = generateId();

  constructor() {
    let observer: ResizeObserver;
    effect(cleanup => {
      const leftScroll = this.leftScroll()!.nativeElement;
      const rightScroll = this.rightScroll()!.nativeElement;
      const tabList = this.tabList().nativeElement;
      const tabListContainer = this.tabListContainer().nativeElement;
      observer = new ResizeObserver(() => {
        this.updateScrollDisplay(leftScroll, tabList, rightScroll);
      });
      observer.observe(tabListContainer);
      cleanup(() => observer?.disconnect());
    });

    effect(
      () => {
        const tabs = this.tabs();
        let activeIndex = this.selectedIndex();
        if (this.selectedId !== undefined && activeIndex === this.selectedId) {
          const id = this.tabMap.get(this.selectedId);
          const i = tabs.findIndex(tab => tab.id === id);
          if (activeIndex !== i && i !== -1) {
            activeIndex = i;
            this.setActive(activeIndex);
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
        tabs.forEach((tab, index) => {
          tab.active.set(activeIndex === index);
          this.tabMap.set(index, tab.id);
        });

        this.selectedId = activeIndex;

        // scroll to the active tab
        this.scrollToActive(activeIndex);
      },
      { allowSignalWrites: true },
    );

    afterNextRender(() => {
      const el = this.tabList()!.nativeElement;
      const leftScroll = this.leftScroll()!.nativeElement;
      const rightScroll = this.rightScroll()!.nativeElement;
      this.updateScrollDisplay(leftScroll, el, rightScroll);
      el.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
          this.updateScrollDisplay(leftScroll, el, rightScroll);
        });
      });
    });
  }

  private updateScrollDisplay(leftScroll: HTMLElement, el: HTMLElement, rightScroll: HTMLElement) {
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

  setActive(index: number) {
    this.selectedIndex.set(index);
    this.scrollToActive(index);
    this.selectedTabChange.emit(index);
  }

  private scrollToActive(index: number) {
    const tabList = this.tabList()!.nativeElement;
    const tabs = this.tab().slice(0, index + 1);
    const totalWidth = tabs.reduce((a, c) => a + c.nativeElement.getBoundingClientRect().width, 0);

    const { width } = tabList.getBoundingClientRect();
    const scrollLeft = tabList.scrollLeft;
    const lastTab = tabs[tabs.length - 1].nativeElement;
    const lastTabWidth = lastTab.getBoundingClientRect().width;
    const withoutLastTabWidth = totalWidth - lastTabWidth;

    const isLeftSide = scrollLeft + width / 2 > withoutLastTabWidth + lastTabWidth / 2;
    const left = isLeftSide ? totalWidth - lastTabWidth : totalWidth - width;

    if (withoutLastTabWidth < scrollLeft || totalWidth > scrollLeft + width) {
      tabList.scrollTo({ left, behavior: 'smooth' });
    }
  }
}
