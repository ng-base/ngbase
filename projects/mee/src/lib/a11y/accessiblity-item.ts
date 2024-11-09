import {
  Directive,
  ElementRef,
  input,
  inject,
  model,
  signal,
  effect,
  booleanAttribute,
  output,
  computed,
  OnDestroy,
} from '@angular/core';
import { AccessiblityService } from './accessiblity.service';
import { Subject } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[meeAccessibleItem]',
  host: {
    '[attr.aria-pressed]': 'pressed()',
    '[attr.aria-disabled]': 'disabled()',
    '[tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'onFocus()',
  },
})
export class AccessibleItem<T = any> implements OnDestroy {
  readonly allyService = inject(AccessiblityService);
  readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly id = input<string>('');
  readonly ayId = model<string>('');
  readonly role = input('button');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly data = input<T>();
  readonly skip = input(false, { transform: booleanAttribute });
  readonly level = input(0);
  readonly expandable = input(false);
  readonly expanded = input(false);
  readonly selectedChange = output<number>();

  readonly group = computed(() => this.allyService.getGroup(this.ayId() || ''));
  readonly pressed = signal(false);
  readonly hasPopup = computed(() => this.el.getAttribute('aria-haspopup') === 'true');
  readonly events = new Subject<{
    event: KeyboardEvent;
    type: 'enter' | 'leave' | 'click' | 'key';
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
      if (this.group()?.isPopup()) {
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
    // this.el.classList.add('bg-muted-background');
    this.el.setAttribute('data-focus', 'true');
    if (isKeyboard) this.el.scrollIntoView({ block: 'nearest' });
    this.el.tabIndex = 0;
    // console.log('focus', this.el);
  }

  blur = () => {
    // this.el.classList.remove('bg-muted-background');
    this.el.tabIndex = -1;
    this.el.setAttribute('data-focus', 'false');
    // console.log('blur', this.el);
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
