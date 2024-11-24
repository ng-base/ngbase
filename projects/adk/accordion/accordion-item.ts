import { booleanAttribute, Directive, inject, input, model } from '@angular/core';
import { uniqueId } from '@meeui/adk/utils';
import { MeeAccordionGroup } from './accordion-group';

@Directive({
  selector: '[meeAccordion]',
  exportAs: 'meeAccordion',
})
export class MeeAccordion {
  // Dependencies
  private accordionService = inject(MeeAccordionGroup);

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
