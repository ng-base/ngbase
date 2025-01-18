import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  input,
  linkedSignal,
  WritableSignal,
} from '@angular/core';
import { AccessibleItem } from '@meeui/adk/a11y';

@Directive({
  selector: '[meeList]',
  hostDirectives: [{ directive: AccessibleItem, inputs: ['role', 'disabled'] }],
  host: {
    role: 'list',
  },
})
export class MeeList {
  // Dependencies
  private readonly allyItem = inject(AccessibleItem);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  // Inputs
  readonly ayId = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  constructor() {
    this.allyItem._ayId = linkedSignal(this.ayId) as WritableSignal<string>;
  }

  setAyId(id: string) {
    this.allyItem._ayId.set(id);
  }

  select() {
    this.el.nativeElement.click();
  }

  focus() {
    this.el.nativeElement.scrollIntoView({ block: 'nearest' });
    this.el.nativeElement.classList.add('bg-muted-background');
  }

  unselect() {
    this.el.nativeElement.classList.remove('bg-muted-background');
  }
}

export function provideList(list: typeof MeeList) {
  return {
    provide: MeeList,
    useExisting: list,
  };
}
