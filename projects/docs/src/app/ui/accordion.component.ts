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
    <app-doc-code [tsCode]="tsCode" [adkCode]="adkCode">
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
  accordionMultiple = signal(false);
  tsCode = `
  import { Component } from '@angular/core';
  import { AccordionGroup, Accordion, AccordionHeader } from '@meeui/ui/accordion';

  @Component({
    selector: 'app-root',
    template: \`
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
    \`,
    imports: [AccordionGroup, Accordion, AccordionHeader],
  })
  export class AppComponent {}
  `;

  adkCode = `
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [{ directive: MeeAccordionGroup, inputs: ['multiple'] }],
    template: \`<ng-content />\`,
    host: {
      class: 'block rounded-base border bg-foreground',
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
    template: \`
      <ng-content select="[meeAccordionHeader]" />
      @if (accordion.expanded()) {
        <div meeAccordionContent [@slide] class="overflow-hidden">
          <div class="px-b3 pb-b4 text-muted">
            <ng-content />
          </div>
        </div>
      }
    \`,
    host: {
      class: 'block will-change-auto [&:not(:last-child)]:border-b',
    },
    animations: [slideAnimation],
  })
  export class Accordion {
    readonly accordion = inject(MeeAccordion);
  }

  @Directive({
    selector: '[meeAccordionHeader]',
    hostDirectives: [MeeAccordionHeader],
    host: {
      class: 'flex items-center w-full py-b3 px-b3 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
    },
  })
  export class AccordionHeader {}
`;
}
