import { ChangeDetectionStrategy, Component, Directive, inject } from '@angular/core';
import {
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
    class: 'block rounded-base border bg-foreground',
  },
})
export class AccordionGroup {}

@Component({
  selector: 'mee-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    { directive: NgbAccordion, inputs: ['expanded', 'disabled'], outputs: ['expandedChange'] },
  ],
  imports: [NgbAccordionContent],
  template: `
    <ng-content select="[meeAccordionHeader]" />
    @if (accordion.expanded()) {
      <div ngbAccordionContent [@slide] class="overflow-hidden">
        <div class="px-b3 pb-b4 text-muted">
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
export class Accordion {
  readonly accordion = inject(NgbAccordion);
}

@Directive({
  selector: '[meeAccordionHeader]',
  hostDirectives: [NgbAccordionHeader],
  host: {
    class:
      'flex items-center w-full py-b3 px-b3 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
  },
})
export class AccordionHeader {}
