import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Accordion } from './accordion-item.component';
import { AccordionGroup } from './accordion-group.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

const accordionGroupStub = {
  multiple: signal(false),
  activeId: signal(''),
};

describe('Accordion', () => {
  let component: Accordion;
  let fixture: ComponentFixture<Accordion>;

  beforeEach(async () => {
    accordionGroupStub.multiple.set(false);
    accordionGroupStub.activeId.set('');
    await TestBed.configureTestingModule({
      imports: [Accordion],
      providers: [
        provideNoopAnimations(),
        { provide: AccordionGroup, useValue: accordionGroupStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Accordion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a unique id', () => {
    expect(component.id).toBeTruthy();
  });

  it('should toggle expanded state', () => {
    expect(component.expanded()).toBeFalsy();
    component.toggle();
    expect(component.expanded()).toBeTruthy();
    component.toggle();
    expect(component.expanded()).toBeFalsy();
  });

  it('should render content when expanded', () => {
    component.expanded.set(true);
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('div');
    expect(content).toBeTruthy();
  });

  it('should not render content when collapsed', () => {
    component.expanded.set(false);
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('div');
    expect(content).toBeNull();
  });

  it('should update activeId when expanded', () => {
    component.toggle();
    expect(component.accordionService.activeId()).toBe(component.id);
  });

  it('should not call activeId when multiple is true', () => {
    accordionGroupStub.multiple.set(true);
    component.toggle();
    expect(component.accordionService.activeId()).toBe('');
  });
});
