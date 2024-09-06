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
} from '@angular/core';
import { AccessiblityService } from './accessiblity.service';
import { Subject } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[meeAccessibleItem]',
  host: {
    '[attr.aria-pressed]': 'pressed()',
    // '[attr.disabled]': 'disabled()',
    '[tabindex]': '0',
    '(click)': 'onFocus()',
  },
})
export class AccessibleItem<T = any> {
  readonly allyService = inject(AccessiblityService);
  readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly id = input<string>('');
  readonly ayId = model<string>('');
  readonly role = input('button');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly data = input<T>();
  readonly skip = input(false);
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

  constructor() {
    effect(
      cleanUp => {
        const id = this.ayId();
        if (id) {
          this.allyService.register(id, this);
          cleanUp(() => this.allyService.unregister(id, this));
        }
      },
      { allowSignalWrites: true },
    );
    effect(
      cleanUp => {
        const el = this.host.nativeElement;
        if (this.group()?.isPopup()) {
          el.addEventListener('mouseenter', this.onFocus);
          cleanUp(() => el.removeEventListener('mouseenter', this.onFocus));
        }
      },
      { allowSignalWrites: true },
    );
  }

  get el() {
    return this.host.nativeElement;
  }

  private onFocus = () => {
    this.group()?.focusItem(this);
  };

  focus(popup: boolean) {
    if (!popup) this.el.focus();
    this.el.classList.add('bg-muted-background');
    this.el.scrollIntoView({ block: 'nearest' });
    this.el.tabIndex = 0;
    // console.log('focus', this.el);
  }

  blur = () => {
    this.el.classList.remove('bg-muted-background');
    this.el.tabIndex = -1;
    // console.log('blur', this.el);
  };

  click() {
    this.el.click();
    this.selectedChange.emit(this.count++);
  }
}
