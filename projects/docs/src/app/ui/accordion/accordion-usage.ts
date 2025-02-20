import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AccordionGroup, Accordion, AccordionHeader } from '@meeui/ui/accordion';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccordionGroup, Accordion, AccordionHeader],
  template: `
    <mee-accordion-group multiple>
      <mee-accordion>
        <button meeAccordionHeader>Heading 1</button>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
          minima quis, accusamus vero voluptatem cumque. Impedit!
        </p>
      </mee-accordion>
      <mee-accordion>
        <button meeAccordionHeader>Heading 2</button>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
          minima quis, accusamus vero voluptatem cumque. Impedit!
        </p>
      </mee-accordion>
    </mee-accordion-group>
  `,
})
export class AppComponent {}
