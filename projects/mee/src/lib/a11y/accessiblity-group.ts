import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
  output,
  signal,
  untracked,
} from '@angular/core';
import { Directionality } from '@meeui/ui/adk';
import { AccessibleItem } from './accessiblity-item';
import { AccessiblityService } from './accessiblity.service';

type Direction = 'next' | 'previous' | 'up' | 'down' | 'first' | 'last';

@Directive({
  selector: '[meeAccessibleGroup]',
  host: {
    role: 'group',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
    '[attr.aria-disabled]': 'disabled()',
    tabindex: '0',
  },
})
export class AccessibleGroup implements OnDestroy {
  private readonly allyService = inject(AccessiblityService);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly dir = inject(Directionality);

  readonly ayId = model<string | undefined>('');
  readonly columns = input<number>();
  readonly ariaLabel = input<string>('');
  readonly ariaLabelledby = input<string>('');
  readonly isPopup = input(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly clickable = model(false);
  readonly initialFocus = input(true);

  private focusedItem?: WeakRef<AccessibleItem>;
  private isOn = signal(false);

  readonly elements = signal<AccessibleItem[]>([]);

  readonly items = computed(() => {
    const _ = this.ayId() || '';
    const items = this.elements();
    // console.count(`items changed ${this.ayId()}`);
    // Sort items based on their position in the DOM
    items.sort((a, b) => {
      return a.host.nativeElement.compareDocumentPosition(b.host.nativeElement) ===
        Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1;
    });
    return items;
  });

  readonly focusChanged = output<{ current: AccessibleItem; previous?: AccessibleItem }>();

  constructor() {
    this.el.nativeElement.style.outline = 'none';
    effect(cleanup => {
      const id = this.ayId();
      if (id) {
        this.allyService.addGroup(id, this);
        cleanup(() => this.allyService.removeGroup(id));
      }
    });
    effect(() => {
      const items = this.items();
      const isOn = this.isOn();
      // this.log('group', items);
      untracked(() => {
        items.forEach(item => item.blur());
        this.log('focus', items.length, isOn, this.initialFocus());
        let item = this.focusedItem?.deref();
        if (items.length && isOn && this.initialFocus()) {
          if (!item || !items.includes(item)) {
            item = items[0];
          }
          this.focusItem(item);
        }
      });
    });
    effect(() => {
      const isPopup = this.isPopup();
      untracked(() => {
        if (isPopup) {
          this.on();
        } else {
          this.el.nativeElement.addEventListener('focusin', this.handleFocusIn);
          this.el.nativeElement.addEventListener('focusout', this.handleFocusOut);
        }
      });
    });
  }

  handleFocusIn = (_: FocusEvent) => {
    if (!this.isOn()) {
      this.on();
    }
  };

  handleFocusOut = (event: FocusEvent) => {
    if (!this.el.nativeElement.contains(event.relatedTarget as Node)) {
      // console.count(`focus out ${this.ayId()}`);
      this.off();
    }
  };

  on = () => {
    this.allyService.setActiveGroup(this.ayId()!);
    // console.count(`focus in ${this.ayId()}`);
    if (this.isPopup()) {
      this.document.querySelectorAll('body > *').forEach(el => {
        if (el.tagName !== 'MEE-PORTAL') {
          el.setAttribute('tabindex', '-1');
          el.setAttribute('aria-hidden', 'true');
        }
      });
    }
    this.document.addEventListener('keydown', this.onKeyDown);
    this.isOn.set(true);
    this.el.nativeElement.tabIndex = -1;
  };

  off = () => {
    if (this.isPopup()) {
      this.document.querySelectorAll('body > *').forEach(el => {
        el.removeAttribute('tabindex');
        el.removeAttribute('aria-hidden');
      });
    }
    // console.count(`off ${this.ayId()}`);
    this.document.removeEventListener('keydown', this.onKeyDown);
    this.isOn.set(false);
    this.el.nativeElement.tabIndex = 0;
  };

  onKeyDown = (event: KeyboardEvent) => {
    const items = this.items();
    // this.log('key down', this.ayId(), event.key, items.length);
    if (!items.length || !this.allyService.isActive(this.ayId()!)) return;

    let item = this.focusedItem?.deref();
    // If there is no focused item, then wait for the first key press to focus the item
    if (!item) return;
    const currentIndex = item ? items.indexOf(item) : -1;
    let nextIndex: number | null = null;

    // Calculate the number of columns in the grid
    // const gridRect = this.el.nativeElement.getBoundingClientRect();
    // const itemWidth = items[0].host.nativeElement.offsetWidth;
    const columns = this.columns() || 1;
    let direction: Direction = 'next';

    const isInput = (event.target as HTMLInputElement).tagName === 'INPUT';

    // if the direction is rtl, then we need to reverse the direction of the arrow keys
    let key = event.key;
    if (this.dir.isRtl()) {
      if (key === 'ArrowRight') key = 'ArrowLeft';
      else if (key === 'ArrowLeft') key = 'ArrowRight';
    }

    switch (key) {
      case 'ArrowRight': {
        if (isInput) return;
        const expand = item.expandable() && !item.expanded();
        if (item.hasPopup() || expand) {
          item.events.next({ event, type: 'key', item });
          item.click();
          return;
        }
        nextIndex = (currentIndex + 1) % items.length;
        direction = 'next';
        break;
      }
      case 'ArrowLeft':
        if (isInput) return;
        const prevGroup = this.allyService.getPreviousGroup();
        let prevItem = prevGroup?.focusedItem?.deref();
        const isSameGroup = prevGroup?.ayId() === this.ayId();
        const collapse = item.expandable() && item.expanded();
        if ((!isSameGroup && prevGroup?.isOn() && prevItem) || collapse) {
          prevItem?.events.next({ event, type: 'key', item });
          item.click();
          return;
        } else if (item.expandable()) {
          nextIndex = this.findNextOrPreviousLevelItem(currentIndex, 'previous', items);
        } else {
          nextIndex = (currentIndex - 1 + items.length) % items.length;
        }
        direction = 'previous';
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + columns;
        if (nextIndex >= items.length) {
          nextIndex = nextIndex % columns; // Wrap to top
        }
        direction = 'down';
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - columns;
        if (nextIndex < 0) {
          nextIndex = items.length - (columns - (currentIndex % columns)); // Wrap to bottom
          if (nextIndex >= items.length) nextIndex -= columns;
        }
        direction = 'up';
        break;
      case 'Home':
        nextIndex = this.findNextEnabledItem(
          Math.floor(currentIndex / columns) * columns,
          'next',
          items,
        );
        direction = 'first';
        break;
      case 'End':
        nextIndex = this.findNextEnabledItem(
          Math.min(Math.floor(currentIndex / columns) * columns + columns - 1, items.length - 1),
          'previous',
          items,
        );
        direction = 'last';
        break;
      case 'Tab':
        if (this.isPopup()) {
          // this.log('tab', event, this.isPopup());
          event.preventDefault();
        }
        return;
      case 'Enter':
      case ' ':
        if (item && !(event.key === ' ' && isInput)) {
          event.preventDefault();
          event.stopPropagation();
          item.click();
        }
        return;
      default:
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    item?.blur();
    this.focusIndex(nextIndex, direction);
  };

  private findNextOrPreviousLevelItem(
    currentIndex: number,
    direction: 'next' | 'previous',
    items: AccessibleItem[],
  ): number {
    const currentItem = items[currentIndex];
    const currentLevel = currentItem.level();
    const level = Math.max(0, currentLevel + (direction === 'next' ? 1 : -1));
    let index = currentIndex - 1;
    for (let i = index; i >= 0; i--) {
      const nextItem = items[i];
      if (!nextItem.disabled() && !nextItem.skip() && nextItem.level() === level) {
        return i;
      }
    }
    return currentIndex;
  }

  focusItem(item?: AccessibleItem) {
    const previosItem = this.focusedItem?.deref();
    previosItem?.blur();
    const items = this.items();
    this.log('focusItem', item?.host.nativeElement.textContent);
    item = item ?? items.find(item => !item.disabled() && !item.skip());
    this.log('next focusItem', item?.host.nativeElement.textContent);
    if (!item) return;
    this.focusIndex(items.indexOf(item));
  }

  private focusIndex(nextIndex = 0, direction: Direction = 'next') {
    const items = this.items();
    this.log('focusIndex', nextIndex, direction);
    if (nextIndex !== null && nextIndex >= 0 && nextIndex < items.length) {
      let nextItem = items[nextIndex];
      if (nextItem.disabled() || nextItem.skip()) {
        nextIndex = this.getNextItem(nextIndex, items, direction);
        nextItem = items[nextIndex];
      }
      const previosItem = this.focusedItem?.deref();
      this.focusedItem = new WeakRef(nextItem);
      nextItem.focus(!this.allyService.usingMouse && !this.isPopup(), !this.allyService.usingMouse);
      // this.focusCount++;
      if (this.clickable()) nextItem.click();
      this.focusChanged.emit({ current: nextItem, previous: previosItem });
    }
  }

  // it should start from the current index and move to the next item based on the direction
  // if the current index is the last item, it should move to the first item
  // we should also consider the disabled items
  private getNextItem(currentIndex: number, items: AccessibleItem[], direction: Direction): number {
    // const filteredItems = items.filter(item => !item.disabled() && !item.skip());
    const len = items.length;
    const step =
      direction === 'next'
        ? 1
        : direction === 'previous'
          ? -1
          : direction === 'up'
            ? -(this.columns() || 1)
            : this.columns() || 1;

    for (let i = 0; i < len; i++) {
      const nextIndex = (currentIndex + i * step + len) % len;
      // this.log(totalItems, currentIndex, step, nextIndex);
      const item = items[nextIndex];
      if (!item.disabled() && !item.skip()) {
        // this.log({ currentIndex, items, direction });
        return nextIndex;
      }
    }
    return currentIndex;
  }

  private findNextEnabledItem(
    startIndex: number,
    direction: 'next' | 'previous',
    items: AccessibleItem[],
  ): number {
    const step = direction === 'next' ? 1 : -1;
    const endIndex = direction === 'next' ? items.length : -1;

    for (let i = startIndex; i !== endIndex; i += step) {
      if (!items[i].disabled() && !items[i].skip()) {
        return i;
      }
    }
    return startIndex; // If no enabled item found, return the starting index
  }

  log(...args: any[]) {
    // console.log(...args);
  }

  register(item: AccessibleItem) {
    this.elements.update(x => [...x, item]);
  }

  unregister(item: AccessibleItem) {
    this.elements.update(x => x.filter(y => y !== item));
  }

  ngOnDestroy() {
    this.off();
  }
}
