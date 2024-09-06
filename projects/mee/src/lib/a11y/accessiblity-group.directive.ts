import {
  Directive,
  input,
  booleanAttribute,
  inject,
  computed,
  effect,
  OnDestroy,
  ElementRef,
  output,
  signal,
  untracked,
  model,
} from '@angular/core';
import { AccessibleItem } from './accessiblity-item.directive';
import { AccessiblityService } from './accessiblity.service';
import { DOCUMENT } from '@angular/common';

type Direction = 'next' | 'previous' | 'up' | 'down' | 'first' | 'last';

@Directive({
  standalone: true,
  selector: '[meeAccessibleGroup]',
  host: {
    role: 'group',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
    '[attr.aria-disabled]': 'disabled()',
    '[tabindex]': '0',
  },
})
export class AccessibleGroup implements OnDestroy {
  private readonly allyService = inject(AccessiblityService);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);

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

  readonly items = computed(() => {
    const key = this.ayId() || '';
    const els = this.allyService.elements();
    const items = els.get(key) || [];
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
    effect(
      cleanup => {
        const id = this.ayId();
        if (id) {
          this.allyService.addGroup(id, this);
          cleanup(() => this.allyService.removeGroup(id));
        }
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        const items = this.items();
        const isOn = this.isOn();
        untracked(() => {
          items.forEach(item => item.blur());
          if (items.length && isOn && this.initialFocus()) {
            let item = this.focusedItem?.deref() || items[0];
            this.focusItem(item);
          }
        });
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        const isPopup = this.isPopup();
        untracked(() => {
          if (isPopup) {
            this.on();
          } else {
            this.el.nativeElement.addEventListener('focusin', this.handleFocusIn);
            this.el.nativeElement.addEventListener('focusout', this.handleFocusOut);
          }
        });
      },
      { allowSignalWrites: true },
    );
  }

  handleFocusIn = (event: FocusEvent) => {
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
    // console.log('key down', this.ayId(), event.key, items.length);
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

    switch (event.key) {
      case 'ArrowRight':
        if (item.hasPopup()) {
          item.events.next({ event, type: 'key', item });
          return;
        }
        nextIndex = (currentIndex + 1) % items.length;
        direction = 'next';
        break;
      case 'ArrowLeft':
        const prevGroup = this.allyService.getPreviousGroup();
        let prevItem = prevGroup?.focusedItem?.deref();
        if (prevGroup?.isOn() && prevItem) {
          prevItem.events.next({ event, type: 'key', item });
          return;
        }
        nextIndex = (currentIndex - 1 + items.length) % items.length;
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
          event.preventDefault();
        }
        return;
      case 'Enter':
      case ' ':
        if (item) {
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

  focusItem(item?: AccessibleItem) {
    const previosItem = this.focusedItem?.deref();
    previosItem?.blur();
    const items = this.items();
    item = item ?? items.find(item => !item.disabled() && !item.skip());
    if (!item) return;
    this.focusIndex(items.indexOf(item));
  }

  private focusIndex(nextIndex = 0, direction: Direction = 'next') {
    const items = this.items();
    if (nextIndex !== null && nextIndex >= 0 && nextIndex < items.length) {
      let nextItem = items[nextIndex];
      if (nextItem.disabled() || nextItem.skip()) {
        nextIndex = this.getNextItem(nextIndex, items, direction);
        nextItem = items[nextIndex];
      }
      const previosItem = this.focusedItem?.deref();
      this.focusedItem = new WeakRef(nextItem);
      nextItem.focus(this.isPopup());
      if (this.clickable()) nextItem.click();
      this.focusChanged.emit({ current: nextItem, previous: previosItem });
    }
  }

  // it should start from the current index and move to the next item based on the direction
  // if the current index is the last item, it should move to the first item
  // we should also consider the disabled items
  private getNextItem(currentIndex: number, items: AccessibleItem[], direction: Direction): number {
    const totalItems = items.length;
    const step =
      direction === 'next'
        ? 1
        : direction === 'previous'
          ? -1
          : direction === 'up'
            ? -(this.columns() || 1)
            : this.columns() || 1;

    for (let i = 0; i < totalItems; i++) {
      const nextIndex = (currentIndex + i * step + totalItems) % totalItems;
      // console.log(totalItems, currentIndex, step, nextIndex);
      const item = items[nextIndex];
      if (!item.disabled() && !item.skip()) {
        // console.log({ currentIndex, items, direction });
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
    console.log(...args);
  }

  ngOnDestroy() {
    this.off();
  }
}
