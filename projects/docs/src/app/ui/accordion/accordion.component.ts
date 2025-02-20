import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Accordion, AccordionGroup, AccordionHeader } from '@meeui/ui/accordion';
import { Checkbox } from '@meeui/ui/checkbox';
import { Heading } from '@meeui/ui/typography';
import { DocCode, getCode } from '../code.component';

@Component({
  selector: 'app-accordion',
  imports: [FormsModule, Heading, AccordionGroup, Accordion, AccordionHeader, Checkbox, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader="sm" class="mb-5" id="accordionPage">Accordion</h4>
    <app-doc-code [tsCode]="tsCode()" [adkCode]="adkCode()" [referencesCode]="references()">
      <mee-checkbox [(ngModel)]="accordionMultiple">Multiple</mee-checkbox>
      <mee-accordion-group [multiple]="accordionMultiple()" class="w-full md:w-96">
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
        <mee-accordion disabled>
          <button meeAccordionHeader>Heading 3</button>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
            minima quis, accusamus vero voluptatem cumque. Impedit!
          </p>
        </mee-accordion>
      </mee-accordion-group>
    </app-doc-code>
  `,
})
export default class AccordionComponent {
  readonly accordionMultiple = signal(false);

  readonly tsCode = getCode('accordion/accordion-usage.ts');
  readonly references = getCode('accordion/accordion-reference.ts');
  readonly adkCode = getCode('accordion/accordion-adk.ts');
}
