import { Accordion } from './accordion-item.component';
import { AccordionGroup } from './accordion-group.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { render, RenderResult } from '../test';

const accordionGroupStub = {
  multiple: signal(false),
  activeId: signal(''),
};

describe('Accordion', () => {
  let view: RenderResult<Accordion>;

  beforeEach(async () => {
    accordionGroupStub.multiple.set(false);
    accordionGroupStub.activeId.set('');

    view = await render(Accordion, [
      provideNoopAnimations(),
      { provide: AccordionGroup, useValue: accordionGroupStub },
    ]);
    view.detectChanges();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should have a unique id', () => {
    expect(view.host.id).toBeTruthy();
  });

  it('should toggle expanded state', () => {
    expect(view.host.expanded()).toBeFalsy();
    view.host.toggle();
    expect(view.host.expanded()).toBeTruthy();
    view.host.toggle();
    expect(view.host.expanded()).toBeFalsy();
  });

  it('should render content when expanded', () => {
    view.host.expanded.set(true);
    view.detectChanges();
    expect(view.$('div')).toBeTruthy();
  });

  it('should not render content when collapsed', () => {
    view.host.expanded.set(false);
    view.detectChanges();
    expect(view.$('div')).toBeFalsy();
  });

  it('should update activeId when expanded', () => {
    view.host.toggle();
    expect(accordionGroupStub.activeId()).toBe(view.host.id);
  });

  it('should not call activeId when multiple is true', () => {
    accordionGroupStub.multiple.set(true);
    view.host.toggle();
    expect(accordionGroupStub.activeId()).toBe('');
  });
});
