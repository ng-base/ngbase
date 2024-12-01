import { booleanAttribute, Directive, ElementRef, inject, input } from '@angular/core';
import { AccessibleItem } from '@meeui/adk/a11y';

@Directive({
  selector: '[meeList]',
  host: {
    role: 'list',
  },
  hostDirectives: [{ directive: AccessibleItem, inputs: ['role', 'disabled'] }],
})
export class MeeList {
  // Dependencies
  private readonly allyItem = inject(AccessibleItem);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  // Inputs
  readonly disabled = input(false, { transform: booleanAttribute });

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
