import { Component, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MeeAccordionGroup } from '@meeui/adk/accordion';
import { render, RenderResult } from '@meeui/adk/test';
import { AccordionGroup } from './accordion-group';
import { AccordionHeader } from './accordion-header';
import { Accordion } from './accordion-item';

@Component({
  imports: [Accordion, AccordionGroup, AccordionHeader],
  template: `
    <mee-accordion-group [multiple]="multiple()">
      <mee-accordion>
        <div meeAccordionHeader class="header1">Header 1</div>
        <div>Content 1</div>
      </mee-accordion>
      <mee-accordion>
        <div meeAccordionHeader class="header2">Header 2</div>
        <div>Content 2</div>
      </mee-accordion>
    </mee-accordion-group>
  `,
})
class TestHostComponent {
  multiple = signal(false);
}

describe('AccordionGroup', () => {
  let component: MeeAccordionGroup;
  let view: RenderResult<TestHostComponent>;

  beforeEach(async () => {
    view = await render(TestHostComponent, [provideNoopAnimations()]);
    component = view.viewChild(MeeAccordionGroup);
    view.detectChanges();
  });

  function click(selector: string) {
    view.$0(selector).click();
    view.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have multiple set to false by default', () => {
    expect(component.multiple()).toBeFalsy();
  });

  it('should have an empty activeId by default', () => {
    expect(component.activeId()).toBe('');
  });

  it('should query all accordion items', () => {
    const accordionItems = component.items();
    expect(accordionItems.length).toBe(2);
  });

  it('should set the activeId when an accordion header is clicked', () => {
    click('.header1');
    expect(component.activeId()).toBe(component.items()[0].id);
  });

  it('should toggle the activeId when another accordion header is clicked', () => {
    const items = component.items();
    const first = items[0];
    const second = items[1];
    click('.header1');
    expect(component.activeId()).toBe(first.id);
    expect(first.expanded()).toBe(true);
    expect(second.expanded()).toBe(false);

    click('.header2');
    expect(component.activeId()).toBe(second.id);
    expect(first.expanded()).toBe(false);
    expect(second.expanded()).toBe(true);
  });

  it('should not control the activeId when multiple is set to true', () => {
    view.host.multiple.set(true);
    view.detectChanges();

    click('.header1');
    expect(component.activeId()).toBe('');
    expect(component.items()[0].expanded()).toBe(true);
    expect(component.items()[1].expanded()).toBe(false);

    click('.header2');
    expect(component.activeId()).toBe('');
    expect(component.items()[0].expanded()).toBe(true);
    expect(component.items()[1].expanded()).toBe(true);
  });
});
