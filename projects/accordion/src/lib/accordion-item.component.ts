import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AccordionService } from './accordion.service';
import { generateId } from '../../../utils';

@Component({
  standalone: true,
  selector: 'mee-accordion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="w-full py-4 text-left font-medium" (click)="toggleActive()">
      <ng-content select="h4"></ng-content>
    </button>
    @if (active()) {
      <div class="pb-4">
        <ng-content></ng-content>
      </div>
    }
  `,
  styles: `
    :host {
      @apply block border-b border-gray-200;
    }
  `,
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
