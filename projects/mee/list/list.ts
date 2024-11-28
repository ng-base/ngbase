import { booleanAttribute, Directive, ElementRef, inject, input } from '@angular/core';
import { AccessibleItem } from '@meeui/adk/a11y';

@Directive({
  selector: '[meeListStyle]',
  host: {
    class:
      'flex items-center gap-b2 py-b2 px-b2 hover:bg-muted-background cursor-pointer rounded-md text-left data-[focus="true"]:bg-muted-background',
  },
})
export class ListStyle {}

@Directive({
  selector: '[meeList]',
  host: {
    role: 'list',
    '[class]': 'disabled() ? "pointer-events-none cursor-not-allowed opacity-50" : ""',
  },
  hostDirectives: [
    ListStyle,
    {
      directive: AccessibleItem,
      inputs: ['role', 'disabled', 'ayId'],
    },
  ],
})
export class List {
  // Dependencies
  readonly allyItem = inject(AccessibleItem);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

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
