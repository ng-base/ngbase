import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  aliasAccordion,
  NgbAccordion,
  NgbAccordionContent,
  NgbAccordionGroup,
  NgbAccordionHeader,
  slideAnimation,
} from '@ngbase/adk/accordion';

@Component({
  selector: 'mee-accordion-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: NgbAccordionGroup, inputs: ['multiple'] }],
  template: `<ng-content />`,
  host: {
    class: 'block rounded-lg border bg-foreground',
  },
})
export class AccordionGroup {}

@Component({
  selector: 'mee-accordion',
  exportAs: 'meeAccordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasAccordion(Accordion)],
  imports: [NgbAccordionContent],
  template: `
    <ng-content select="[meeAccordionHeader]" />
    @if (expanded()) {
      <div ngbAccordionContent [@slide] class="overflow-hidden">
        <div class="px-3 pb-4 text-muted">
          <ng-content />
        </div>
      </div>
    }
  `,
  host: {
    class: 'block will-change-auto [&:not(:last-child)]:border-b',
  },
  animations: [slideAnimation],
})
export class Accordion extends NgbAccordion {}

@Directive({
  selector: '[meeAccordionHeader]',
  hostDirectives: [NgbAccordionHeader],
  host: {
    class:
      'flex items-center w-full py-3 px-3 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
  },
})
export class AccordionHeader {}
