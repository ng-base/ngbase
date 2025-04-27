import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  input,
  linkedSignal,
  WritableSignal,
} from '@angular/core';
import { AccessibleItem } from '@ngbase/adk/a11y';

@Directive({
  selector: '[ngbList]',
  hostDirectives: [{ directive: AccessibleItem, inputs: ['role', 'disabled'] }],
  host: {
    role: 'list',
  },
})
export class NgbList {
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
    this.el.nativeElement.classList.add('bg-muted');
  }

  unselect() {
    this.el.nativeElement.classList.remove('bg-muted');
  }
}

export function provideList(list: typeof NgbList) {
  return {
    provide: NgbList,
    useExisting: list,
  };
}
