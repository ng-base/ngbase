import { Component, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@ngbase/adk/test';
import { NgbAccordionGroup } from './accordion-group';
import { NgbAccordion } from './accordion-item';
import { NgbAccordionContent } from './accordion-content';
import { NgbAccordionHeader } from './public-api';

const accordionGroupStub = {
  multiple: signal(false),
  activeId: signal(''),
};

@Component({
  imports: [NgbAccordion, NgbAccordionHeader, NgbAccordionContent],
  template: `<div #accordion="ngbAccordion" ngbAccordion>
    <div ngbAccordionHeader>Header</div>
    @if (accordion.expanded()) {
      <div ngbAccordionContent id="content">Content</div>
    }
  </div>`,
})
class TestComponent {}

describe('Accordion', () => {
  let view: RenderResult<TestComponent>;
  let accordion: NgbAccordion;

  beforeEach(async () => {
    accordionGroupStub.multiple.set(false);
    accordionGroupStub.activeId.set('');

    view = await render(TestComponent, [
      provideNoopAnimations(),
      { provide: NgbAccordionGroup, useValue: accordionGroupStub },
    ]);
    accordion = view.viewChild(NgbAccordion)!;
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
    expect(view.$('div')).toBeTruthy();
  });

  it('should not render content when collapsed', () => {
    accordion.expanded.set(false);
    view.detectChanges();
    expect(view.$('#content')).toBeFalsy();
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
