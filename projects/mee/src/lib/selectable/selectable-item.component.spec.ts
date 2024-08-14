import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectableItem } from './selectable-item.component';
import { Selectable } from './selectable.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

// Mock Selectable class
class MockSelectable<T> {
  select = jest.fn();
}

// Test host component
@Component({
  template: '<button meeSelectableItem [value]="testValue"></button>',
})
class TestHostComponent {
  testValue = 'test';
}

describe('SelectableItem', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let selectableItem: SelectableItem<string>;
  let mockSelectable: MockSelectable<string>;

  beforeEach(async () => {
    mockSelectable = new MockSelectable<string>();

    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [SelectableItem],
      providers: [{ provide: Selectable, useValue: mockSelectable }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    selectableItem = fixture.debugElement.query(By.directive(SelectableItem)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(selectableItem).toBeTruthy();
  });

  it('should have the correct input value', () => {
    expect(selectableItem.value()).toBe('test');
  });

  it('should have the correct default selected state', () => {
    expect(selectableItem.selected()).toBeFalsy();
  });

  it('should have the correct CSS classes when not selected', () => {
    const element = fixture.debugElement.query(By.directive(SelectableItem)).nativeElement;
    expect(element.classList.contains('opacity-60')).toBeTruthy();
    expect(element.classList.contains('bg-foreground')).toBeFalsy();
    expect(element.classList.contains('shadow-md')).toBeFalsy();
    expect(element.classList.contains('ring-1')).toBeFalsy();
    expect(element.classList.contains('ring-border')).toBeFalsy();
  });

  it('should have the correct CSS classes when selected', () => {
    selectableItem.selected.set(true);
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.directive(SelectableItem)).nativeElement;
    expect(element.classList.contains('opacity-60')).toBeFalsy();
    expect(element.classList.contains('bg-foreground')).toBeTruthy();
    expect(element.classList.contains('shadow-md')).toBeTruthy();
    expect(element.classList.contains('ring-1')).toBeTruthy();
    expect(element.classList.contains('ring-border')).toBeTruthy();
  });

  it('should call select method when clicked', () => {
    const selectSpy = jest.spyOn(selectableItem, 'select');
    const element = fixture.debugElement.query(By.directive(SelectableItem)).nativeElement;
    element.click();
    expect(selectSpy).toHaveBeenCalled();
  });

  it('should have the correct attributes', () => {
    const element = fixture.debugElement.query(By.directive(SelectableItem)).nativeElement;
    expect(element.getAttribute('role')).toBe('tab');
  });
});
