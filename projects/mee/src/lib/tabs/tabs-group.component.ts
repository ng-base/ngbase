import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  contentChildren,
  effect,
  model,
  viewChild,
  viewChildren,
} from '@angular/core';
import { Tab } from './tabs.component';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'mee-tabs',
  standalone: true,
  imports: [NgComponentOutlet, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="relative flex overflow-hidden border-b" role="tabList">
      <button
        #leftScroll
        (click)="scroll('left')"
        class="absolute left-0 grid h-full place-items-center bg-foreground px-2"
      >
        <
      </button>
      <div #tabList class="tabList flex overflow-auto">
        @for (tab of tabs(); track $index) {
          <button
            #tab
            class="border-b-2 border-transparent px-b4 py-b3 font-medium text-muted"
            [class]="
              $index === activeIndex() ? '!border-primary !text-text' : ''
            "
            (click)="setActive($index)"
            [tabindex]="$index === activeIndex() ? 0 : -1"
            [attr.aria-selected]="activeIndex() === $index"
            role="tab"
          >
            @if (tab.header()) {
              <ng-container *ngTemplateOutlet="tab.header()!"></ng-container>
            } @else {
              {{ tab.label() }}
            }
          </button>
        }
      </div>
      <button
        #rightScroll
        (click)="scroll('right')"
        class="absolute right-0 grid h-full place-items-center bg-foreground px-2"
      >
        >
      </button>
    </div>
    <ng-content></ng-content> `,
  styles: `
    .tabList {
      scrollbar-width: none;
    }
  `,
  host: {
    class: 'bg-foreground block',
  },
})
export class Tabs {
  tabList = viewChild<ElementRef<HTMLElement>>('tabList');
  tab = viewChildren<ElementRef<HTMLElement>>('tab');
  leftScroll = viewChild<ElementRef<HTMLElement>>('leftScroll');
  rightScroll = viewChild<ElementRef<HTMLElement>>('rightScroll');
  tabs = contentChildren(Tab);
  activeIndex = model(0);

  constructor() {
    effect(
      () => {
        const tabs = this.tabs();
        const activeIndex = this.activeIndex();

        tabs.forEach((tab, index) => {
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

  private updateScrollDisplay(
    leftScroll: HTMLElement,
    el: HTMLElement,
    rightScroll: HTMLElement,
  ) {
    leftScroll.style.display = el.scrollLeft > 0 ? 'block' : 'none';
    rightScroll.style.display =
      el.scrollLeft + el.clientWidth < el.scrollWidth ? 'block' : 'none';
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
    this.activeIndex.set(index);
    const tabList = this.tabList()!.nativeElement;
    const tabs = this.tab().slice(0, index + 1);
    const totalWidth = tabs.reduce(
      (a, c) => a + c.nativeElement.getBoundingClientRect().width,
      0,
    );

    const { width } = tabList.getBoundingClientRect();
    const scrollLeft = tabList.scrollLeft;
    const lastTab = tabs[tabs.length - 1].nativeElement;
    const lastTabWidth = lastTab.getBoundingClientRect().width;
    const withoutLastTabWidth = totalWidth - lastTabWidth;

    const isLeftSide =
      scrollLeft + width / 2 > withoutLastTabWidth + lastTabWidth / 2;
    const left = isLeftSide ? totalWidth - lastTabWidth : totalWidth - width;

    if (withoutLastTabWidth < scrollLeft || totalWidth > scrollLeft + width) {
      tabList.scrollTo({ left, behavior: 'smooth' });
    }
  }
}
