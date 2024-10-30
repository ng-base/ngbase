import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { uniqueId } from '../utils';
import { AccordionGroup } from './accordion-group';

@Component({
  standalone: true,
  selector: 'mee-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="[meeAccordionHeader]" />
    @if (expanded()) {
      <div
        [@slide]
        class="overflow-hidden"
        role="region"
        [id]="id"
        [attr.aria-labelledby]="'accordion-' + id"
      >
        <ng-content />
      </div>
    }
  `,
  host: {
    class: 'block will-change-auto',
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
  // Dependencies
  private accordionService = inject(AccordionGroup);

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
