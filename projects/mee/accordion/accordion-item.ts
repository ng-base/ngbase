import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MeeAccordion, MeeAccordionContent } from '@meeui/adk/accordion';

@Component({
  selector: 'mee-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  hostDirectives: [
    { directive: MeeAccordion, inputs: ['expanded', 'disabled'], outputs: ['expandedChange'] },
  ],
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
  readonly accordion = inject(MeeAccordion);
}
