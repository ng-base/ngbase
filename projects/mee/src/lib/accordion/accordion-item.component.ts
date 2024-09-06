import { ChangeDetectionStrategy, Component, inject, input, model } from '@angular/core';
import { generateId } from '../utils';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AccordionGroup } from './accordion-group.component';

@Component({
  standalone: true,
  selector: 'mee-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="[meeAccordionHeader]"></ng-content>
    @if (expanded()) {
      <div
        [@slide]
        class="overflow-hidden"
        role="region"
        [id]="id"
        [attr.aria-labelledby]="'accordion-' + id"
      >
        <ng-content></ng-content>
      </div>
    }
  `,
  host: {
    class: 'block',
  },
  exportAs: 'meeAccordionItem',
  animations: [
    trigger('slide', [
      state('void', style({ height: '0', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition('void => *', animate('300ms ease')),
      transition('* => void', animate('300ms ease')),
    ]),
  ],
})
export class Accordion {
  readonly expanded = model(false);
  readonly id = generateId();

  accordionService = inject(AccordionGroup);

  toggle() {
    this.expanded.update(v => !v);
    if (this.accordionService.multiple()) {
      return;
    }
    this.accordionService.activeId.set(this.expanded() ? this.id : '');
  }
}
