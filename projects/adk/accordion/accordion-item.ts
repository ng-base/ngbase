import { booleanAttribute, Directive, inject, input, model } from '@angular/core';
import { uniqueId } from '@ngbase/adk/utils';
import { NgbAccordionGroup } from './accordion-group';

@Directive({
  selector: '[ngbAccordion]',
  exportAs: 'ngbAccordion',
})
export class NgbAccordion {
  // Dependencies
  private accordionService = inject(NgbAccordionGroup);

  // Inputs
  readonly expanded = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });

  // locals
  readonly id = uniqueId();

  toggle() {
    this.expanded.update(v => !v);
    if (this.accordionService.multiple()) {
      return;
    }
    this.accordionService.activeId.set(this.expanded() ? this.id : '');
  }
}

export function aliasAccordion(accordion: typeof NgbAccordion) {
  return { provide: NgbAccordion, useExisting: accordion };
}
