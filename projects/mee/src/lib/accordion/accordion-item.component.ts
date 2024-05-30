import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
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
    <button class="w-full py-b text-left font-medium" (click)="toggleActive()">
      <ng-content select="h4"></ng-content>
    </button>
    @if (active()) {
      <div [@slide]>
        <div class="pb-b">
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      @apply block border-b border-border;
    }
  `,
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
  active = signal(false);
  id = generateId();

  accordionService = inject(AccordionService);

  toggleActive() {
    this.active.update((v) => !v);
    this.accordionService.active.set(this.active() ? this.id : '');
  }
}
