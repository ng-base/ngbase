import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  OnDestroy,
  output,
  Signal,
  signal,
} from '@angular/core';
import { Subject } from 'rxjs';
import { AccessibilityService } from './accessibility.service';

@Directive({
  selector: '[ngbAccessibleItem]',
  host: {
    '[attr.aria-pressed]': 'pressed()',
    '[attr.aria-disabled]': '_disabled() || null',
    '[attr.aria-selected]': '_selected()',
    '[tabindex]': '_disabled() ? -1 : 0',
    '(click)': 'onFocus()',
  },
})
export class AccessibleItem<T = any> implements OnDestroy {
  readonly allyService = inject(AccessibilityService);
  readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly id = input<string>('');
  readonly ayId = input<string>('');
  readonly role = input('button');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly selected = input(false, { transform: booleanAttribute });
  readonly data = input<T>();
  readonly skip = input(false, { transform: booleanAttribute });
  readonly level = model(0);
  readonly expandable = model(false);
  readonly expanded = model(false);
  readonly selectedChange = output<number>();

  // inputs writable for hacky reasons
  _disabled = linkedSignal(this.disabled) as Signal<boolean>;
  _selected = linkedSignal(this.selected) as Signal<boolean>;
  _ayId = linkedSignal(this.ayId);
  _data = linkedSignal(this.data);
  _id = linkedSignal(this.id);
  _skip = linkedSignal(this.skip);
  _expandable = linkedSignal(this.expandable);
  _expanded = linkedSignal(this.expanded);

  readonly group = computed(() => this.allyService.getGroup(this._ayId() || ''));
  readonly pressed = signal(false);
  readonly hasPopup = computed(() => this.el.getAttribute('aria-haspopup') === 'true');
  readonly events = new Subject<{
    event: KeyboardEvent;
    type: 'enter' | 'leave' | 'click' | 'keyRight' | 'keyLeft';
    item: AccessibleItem;
  }>();
  private count = 1;
  /**
   * @internal when component is destroyed, we don't want to emit events
   */
  private isDestroyed = false;

  constructor() {
    effect(cleanUp => {
      const group = this.group();
      if (group) {
        group.register(this);
        cleanUp(() => group.unregister(this));
      }
    });
    effect(cleanUp => {
      const el = this.host.nativeElement;
      if (this.group()?._isPopup()) {
        el.addEventListener('mouseenter', this.onFocus);
        cleanUp(() => el.removeEventListener('mouseenter', this.onFocus));
      }
    });
  }

  get el() {
    return this.host.nativeElement;
  }

  private onFocus = () => {
    if (this.allyService.usingMouse) {
      // console.log('using mouse');
      this.group()?.focusItem(this);
    }
  };

  focus(focus: boolean, isKeyboard: boolean) {
    // console.log('focus', focus);
    // console.log('scrollIntoView', isKeyboard);
    if (focus) this.el.focus();
    // this.el.classList.add('bg-muted');
    this.el.setAttribute('data-focus', 'true');
    if (isKeyboard) this.el.scrollIntoView({ block: 'nearest' });
    this.el.tabIndex = 0;
  }

  blur = () => {
    this.el.tabIndex = -1;
    this.el.removeAttribute('data-focus');
  };

  click() {
    this.el.tabIndex = 0;
    this.el.click();
    this.el.focus();
    // sometimes the click event detroyes the component
    if (!this.isDestroyed) {
      this.selectedChange.emit(this.count++);
      this.events.next({ event: new KeyboardEvent('click'), type: 'click', item: this });
    }
  }

  ngOnDestroy() {
    this.isDestroyed = true;
  }
}
