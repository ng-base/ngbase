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
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { Icons } from '../icon';

@Component({
  selector: 'mee-tabs',
  standalone: true,
  imports: [NgComponentOutlet, NgTemplateOutlet, Icons],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
  template: `<div class="relative flex overflow-hidden border-b" role="tabList">
      <button
        #leftScroll
        (click)="scroll('left')"
        class="absolute left-0 grid h-full place-items-center bg-foreground px-2"
      >
        <mee-icon name="lucideChevronLeft"></mee-icon>
      </button>
      <nav role="tablist" #tabList class="tabList flex overflow-auto">
        @for (tab of tabs(); track $index) {
          <button
            #tab
            class="whitespace-nowrap border-b-2 border-transparent px-b4 py-b3 font-medium text-muted"
            [class]="$index === selectedIndex() ? '!border-primary !text-text' : ''"
            (click)="setActive($index)"
            [tabindex]="$index === selectedIndex() ? 0 : -1"
            [attr.aria-selected]="selectedIndex() === $index"
            role="tab"
          >
            @if (tab.header()) {
              <ng-container *ngTemplateOutlet="tab.header()!"></ng-container>
            } @else {
              {{ tab.label() }}
            }
          </button>
        }
      </nav>
      <button
        #rightScroll
        (click)="scroll('right')"
        class="absolute right-0 grid h-full place-items-center bg-foreground px-2"
      >
        <mee-icon name="lucideChevronRight"></mee-icon>
      </button>
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
  tabList = viewChild<ElementRef<HTMLElement>>('tabList');
  tab = viewChildren<ElementRef<HTMLElement>>('tab');
  leftScroll = viewChild<ElementRef<HTMLElement>>('leftScroll');
  rightScroll = viewChild<ElementRef<HTMLElement>>('rightScroll');
  tabs = contentChildren(Tab);
  selectedIndex = model(0);
  selectedTabChange = output<number>();

  constructor() {
    effect(
      () => {
        const tabs = this.tabs();
        const activeIndex = this.selectedIndex();

        tabs.forEach((tab, index) => {
          tab.index = index;
          tab.active.set(activeIndex === index);
        });
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
    this.selectedTabChange.emit(index);
  }
}
