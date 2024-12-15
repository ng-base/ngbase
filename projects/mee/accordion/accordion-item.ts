import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MeeAccordion, MeeAccordionContent, slideAnimation } from '@meeui/adk/accordion';

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
