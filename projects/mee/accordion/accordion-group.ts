import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeAccordionGroup } from '@meeui/adk/accordion';

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
