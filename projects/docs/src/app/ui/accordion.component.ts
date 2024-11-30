import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Accordion, AccordionGroup, AccordionHeader } from '@meeui/ui/accordion';
import { Checkbox } from '@meeui/ui/checkbox';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-accordion',
  imports: [FormsModule, Heading, AccordionGroup, Accordion, AccordionHeader, Checkbox, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="accordionPage">Accordion</h4>
    <app-doc-code [tsCode]="tsCode">
      <mee-checkbox [(ngModel)]="accordionMultiple">Multiple</mee-checkbox>
      <mee-accordion-group
        [multiple]="accordionMultiple()"
        class="w-full rounded-base border bg-foreground md:w-96"
      >
        <mee-accordion class="border-b">
          <button meeAccordionHeader>Heading 1</button>
          <p class="px-b3 pb-b4 text-muted">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
            minima quis, accusamus vero voluptatem cumque. Impedit!
          </p>
        </mee-accordion>
        <mee-accordion class="border-b">
          <button meeAccordionHeader>Heading 2</button>
          <p class="px-b3 pb-b4 text-muted">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
            minima quis, accusamus vero voluptatem cumque. Impedit!
          </p>
        </mee-accordion>
        <mee-accordion disabled>
          <button meeAccordionHeader>Heading 3</button>
          <p class="px-b3 pb-b4 text-muted">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
            minima quis, accusamus vero voluptatem cumque. Impedit!
          </p>
        </mee-accordion>
      </mee-accordion-group>
    </app-doc-code>
  `,
})
export class AccordionComponent {
  accordionMultiple = signal(false);
  tsCode = `
  import { Component } from '@angular/core';
  import { AccordionGroup, Accordion, AccordionHeader } from '@meeui/ui/accordion';

  @Component({
    selector: 'app-root',
    template: \`
      <mee-accordion-group
        [multiple]="true"
        class="rounded-base border bg-foreground"
      >
        <mee-accordion class="border-b">
          <button meeAccordionHeader>Heading 1</button>
          <p class="px-b3 pb-b4 text-muted">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
            minima quis, accusamus vero voluptatem cumque. Impedit!
          </p>
        </mee-accordion>
        <mee-accordion>
          <button meeAccordionHeader>Heading 2</button>
          <p class="px-b3 pb-b4 text-muted">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
            minima quis, accusamus vero voluptatem cumque. Impedit!
          </p>
        </mee-accordion>
      </mee-accordion-group>
    \`,
    imports: [AccordionGroup, Accordion, AccordionHeader],
  })
  export class AppComponent {}
  `;
}
