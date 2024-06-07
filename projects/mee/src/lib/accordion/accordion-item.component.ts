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
  selector: 'mee-accordion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="w-full py-b2 text-left font-medium" (click)="toggleActive()">
      <ng-content select="h4"></ng-content>
    </button>
    @if (active()) {
      <div [@slide]>
        <div class="pb-b2">
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
  host: {
    class: 'block border-b4',
  },
  animations: [
    trigger('slide', [
      state('void', style({ height: '0', overflow: 'hidden' })),
      state('*', style({ height: '*' })),
      transition('void => *', animate('200ms ease-in')),
      transition('* => void', animate('200ms ease-out')),
    ]),
  ],
})
export class AccordionItem {
  active = model(false);
  id = generateId();

  accordionService = inject(AccordionService);

  toggleActive() {
    this.active.update((v) => !v);
    this.accordionService.active.set(this.active() ? this.id : '');
  }
}
