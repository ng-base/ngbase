import {
  Directive,
  ElementRef,
  booleanAttribute,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { AccessibleItem } from '@meeui/adk/a11y';

@Directive({
  selector: '[meeOption]',
  hostDirectives: [AccessibleItem],
  host: {
    role: 'option',
    tabindex: '-1',
    '(click)': 'selectOption()',
  },
})
export class MeeOption<T> {
  readonly allyItem = inject(AccessibleItem);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  // inputs
  readonly value = input<T>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ayId = input<string>();

  // outputs
  readonly onSelectionChange = output<T>();

  readonly multiple = signal(false);
  readonly checked = signal(false);
  readonly active = signal(false);
  private _ayId = linkedSignal({ source: this.ayId, computation: id => id || '' });

  constructor() {
    this.allyItem._ayId = this._ayId;
    this.allyItem._disabled = this.disabled;
  }

  selectOption() {}

  setAyId(id: string) {
    this._ayId.set(id);
  }

  label() {
    return this.el.nativeElement.textContent || '';
  }

  focus() {
    this.el.nativeElement.scrollIntoView({ block: 'nearest' });
    this.el.nativeElement.classList.add('bg-muted-background');
  }

  unselect() {
    this.el.nativeElement.classList.remove('bg-muted-background');
  }

  getValue() {
    return this.value() || this.label();
  }
}
