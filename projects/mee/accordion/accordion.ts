import { ChangeDetectionStrategy, Component, Directive, inject } from '@angular/core';
import {
  MeeAccordion,
  MeeAccordionContent,
  MeeAccordionGroup,
  MeeAccordionHeader,
  slideAnimation,
} from '@meeui/adk/accordion';

@Component({
  selector: 'mee-accordion-group',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: MeeAccordionGroup, inputs: ['multiple'] }],
  host: {
    class: 'block',
  },
})
export class AccordionGroup {}

@Component({
  selector: 'mee-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    { directive: MeeAccordion, inputs: ['expanded', 'disabled'], outputs: ['expandedChange'] },
  ],
  imports: [MeeAccordionContent],
  template: `
    <ng-content select="[meeAccordionHeader]" />
    @if (accordion.expanded()) {
      <div [@slide] class="overflow-hidden" meeAccordionContent>
        <ng-content />
      </div>
    }
  `,
  host: {
    class: 'block will-change-auto',
  },
  animations: [slideAnimation],
})
export class Accordion {
  readonly accordion = inject(MeeAccordion);
}

@Directive({
  selector: '[meeAccordionHeader]',
  host: {
    class: 'flex items-center w-full py-b3 px-b3',
    '[class]': `accordion.disabled() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'`,
  },
  hostDirectives: [MeeAccordionHeader],
})
export class AccordionHeader {
  readonly accordion = inject(MeeAccordion);
}
