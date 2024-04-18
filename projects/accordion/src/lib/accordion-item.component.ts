import { Component, inject } from '@angular/core';
import { AccordionService } from './accordion.service';
import { generateId } from '../../../utils';

@Component({
  standalone: true,
  selector: 'mee-accordion-item',
  template: `
    <button class="w-full py-4 text-left font-medium" (click)="toggleActive()">
      <ng-content select="h4"></ng-content>
    </button>
    @if (active) {
      <ng-content></ng-content>
    }
  `,
  styles: `
    :host {
      @apply block border-b border-gray-200 p-4;
    }
  `,
})
export class AccordionItem {
  active = false;
  id = generateId();

  accordionService = inject(AccordionService);

  toggleActive() {
    this.active = !this.active;
    this.accordionService.active.set(this.active ? this.id : '');
  }
}
