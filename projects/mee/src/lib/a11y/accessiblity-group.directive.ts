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

  private focusedItem?: WeakRef<AccessibleItem>;
  private isOn = signal(false);

  readonly items = computed(() => {
    const items = this.allyService.items(this.ayId() || '');
    // Sort items based on their position in the DOM
    items.sort((a, b) => {
      return a.host.nativeElement.compareDocumentPosition(b.host.nativeElement) ===
        Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1;
    });
    return items;
  });

  readonly focusChanged = output<AccessibleItem>();

  constructor() {
    this.el.nativeElement.style.outline = 'none';
    effect(
      () => {
        const id = this.ayId();
        if (id) {
          this.allyService.addGroup(id, this);
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
          if (items.length && isOn) {
            let item = this.focusedItem?.deref();
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
      console.count(`focus out ${this.ayId()}`);
      this.off();
    }
  };

  on = () => {
    console.count(`focus in ${this.ayId()}`);
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
    console.count(`off ${this.ayId()}`);
    this.document.removeEventListener('keydown', this.onKeyDown);
    this.isOn.set(false);
    this.el.nativeElement.tabIndex = 0;
  };

  onKeyDown = (event: KeyboardEvent) => {
    const items = this.items();
    if (!items.length) return;

    let item = this.focusedItem?.deref();
    const currentIndex = item ? items.indexOf(item) : -1;
    let nextIndex: number | null = null;

    // Calculate the number of columns in the grid
    // const gridRect = this.el.nativeElement.getBoundingClientRect();
    // const itemWidth = items[0].host.nativeElement.offsetWidth;
    const columns = this.columns() || 1;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + items.length) % items.length;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + columns;
        if (nextIndex >= items.length) {
          nextIndex = nextIndex % columns; // Wrap to top
        }
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - columns;
        if (nextIndex < 0) {
          nextIndex = items.length - (columns - (currentIndex % columns)); // Wrap to bottom
          if (nextIndex >= items.length) nextIndex -= columns;
        }
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = items.length - 1;
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
    // event.stopImmediatePropagation();
    item?.blur();
    this.focusIndex(nextIndex);
  };

  focusItem(item?: AccessibleItem) {
    const previosItem = this.focusedItem?.deref();
    previosItem?.blur();
    const items = this.items();
    item = item ?? items.find(item => !item.disabled?.());
    if (!item) return;
    this.focusIndex(items.indexOf(item));
  }

  private focusIndex(nextIndex = 0, direction: 'next' | 'previous' = 'next') {
    const items = this.items();
    if (nextIndex !== null && nextIndex >= 0 && nextIndex < items.length) {
      let nextItem = items[nextIndex];
      if (nextItem.disabled?.()) {
        nextIndex = this.getNextItem(nextIndex, items, direction);
        nextItem = items[nextIndex];
      }
      this.focusedItem = new WeakRef(nextItem);
      nextItem.focus(this.isPopup());
      if (this.clickable()) nextItem.click();
      this.focusChanged.emit(nextItem);
    }
  }

  // it should start from the current index and move to the next item based on the direction
  // if the current index is the last item, it should move to the first item
  // we should also consider the disabled items
  private getNextItem(
    currentIndex: number,
    items: AccessibleItem[],
    direction: 'next' | 'previous',
  ): number {
    const totalItems = items.length;
    const step = direction === 'next' ? 1 : -1;

    for (let i = 0; i < totalItems; i++) {
      const nextIndex = (currentIndex + i * step + totalItems) % totalItems;
      // console.log(totalItems, currentIndex, step, nextIndex);
      if (!items[nextIndex].disabled?.()) {
        return nextIndex;
      }
    }

    return currentIndex;
  }

  ngOnDestroy() {
    this.off();
  }
}
