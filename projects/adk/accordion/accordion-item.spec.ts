import { Component, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@meeui/adk/test';
import { MeeAccordionGroup } from './accordion-group';
import { MeeAccordion } from './accordion-item';
import { MeeAccordionContent } from './accordion-content';
import { MeeAccordionHeader } from './public-api';

const accordionGroupStub = {
  multiple: signal(false),
  activeId: signal(''),
};

@Component({
  imports: [MeeAccordion, MeeAccordionHeader, MeeAccordionContent],
  template: `<div #accordion="meeAccordion" meeAccordion>
    <div meeAccordionHeader>Header</div>
    @if (accordion.expanded()) {
      <div meeAccordionContent id="content">Content</div>
    }
  </div>`,
})
class TestComponent {}

describe('Accordion', () => {
  let view: RenderResult<TestComponent>;
  let accordion: MeeAccordion;

  beforeEach(async () => {
    accordionGroupStub.multiple.set(false);
    accordionGroupStub.activeId.set('');

    view = await render(TestComponent, [
      provideNoopAnimations(),
      { provide: MeeAccordionGroup, useValue: accordionGroupStub },
    ]);
    accordion = view.viewChild(MeeAccordion)!;
    view.detectChanges();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should have a unique id', () => {
    expect(accordion.id).toBeTruthy();
  });

  it('should toggle expanded state', () => {
    expect(accordion.expanded()).toBeFalsy();
    accordion.toggle();
    expect(accordion.expanded()).toBeTruthy();
    accordion.toggle();
    expect(accordion.expanded()).toBeFalsy();
  });

  it('should render content when expanded', () => {
    accordion.expanded.set(true);
    view.detectChanges();
    expect(view.$0('div')).toBeTruthy();
  });

  it('should not render content when collapsed', () => {
    accordion.expanded.set(false);
    view.detectChanges();
    expect(view.$0('#content')).toBeFalsy();
  });

  it('should update activeId when expanded', () => {
    accordion.toggle();
    expect(accordionGroupStub.activeId()).toBe(accordion.id);
  });

  it('should not call activeId when multiple is true', () => {
    accordionGroupStub.multiple.set(true);
    accordion.toggle();
    expect(accordionGroupStub.activeId()).toBe('');
  });
});
