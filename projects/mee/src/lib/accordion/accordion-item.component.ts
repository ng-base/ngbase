import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { AccordionService } from './accordion.service';
import { generateId } from '../utils';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  standalone: true,
  selector: 'mee-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="[meeAccordionHeader]"></ng-content>
    @if (expanded()) {
      <div [@slide]>
        <!-- <div class="pb-b2"> -->
        <ng-content></ng-content>
        <!-- </div> -->
      </div>
    }
  `,
  host: {
    class: 'block',
  },
  exportAs: 'meeAccordionItem',
  animations: [
    trigger('slide', [
      state('void', style({ height: '0', overflow: 'hidden' })),
      state('*', style({ height: '*' })),
      transition('void => *', animate('200ms ease-in')),
      transition('* => void', animate('200ms ease-out')),
    ]),
  ],
})
export class Accordion {
  expanded = model(false);
  id = generateId();

  accordionService = inject(AccordionService);

  toggle() {
    this.expanded.update((v) => !v);
    this.accordionService.activeId.set(this.expanded() ? this.id : '');
  }
}
