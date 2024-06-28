import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionGroup, Accordion } from '@meeui/accordion';
import { Checkbox } from '@meeui/checkbox';
import { Heading } from '@meeui/typography';

@Component({
  standalone: true,
  selector: 'app-accordion',
  imports: [FormsModule, Heading, AccordionGroup, Accordion, Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="accordionPage">Accordion</h4>
    <mee-checkbox [(ngModel)]="accordionMultiple">Multiple</mee-checkbox>
    <mee-accordion-group [multi]="accordionMultiple()">
      <mee-accordion>
        <h4 class="accordion-header">Heading 1</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
          minima quis, accusamus vero voluptatem cumque. Impedit!
        </p>
      </mee-accordion>
      <mee-accordion>
        <h4 class="accordion-header">Heading 2</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
          minima quis, accusamus vero voluptatem cumque. Impedit!
        </p>
      </mee-accordion>
    </mee-accordion-group>
  `,
})
export class AccordionComponent implements OnInit {
  accordionMultiple = signal(false);

  constructor() {}

  ngOnInit() {}
}
