import { Component, ModelSignal, signal } from '@angular/core';
import { render, RenderResult } from '@meeui/ui/test';
import { Selectable } from './selectable';
import { SelectableItem } from './selectable-item';

// Test host component
@Component({
  imports: [SelectableItem],
  template: '<button meeSelectableItem [value]="testValue"></button>',
})
class TestHostComponent {
  testValue = 'test';
}

const SelectableStub: Partial<Selectable<string>> = {
  activeIndex: signal(0) as unknown as ModelSignal<string | undefined>,
  setValue: jest.fn(),
};

describe('SelectableItem', () => {
  let view: RenderResult<TestHostComponent>;
  let selectableItem: SelectableItem<string>;
  let selectable: Selectable<string>;

  beforeEach(async () => {
    view = await render(TestHostComponent, [{ provide: Selectable, useValue: SelectableStub }]);
    selectable = view.inject(Selectable<string>);
    selectableItem = view.viewChild(SelectableItem<string>);
    view.detectChanges();
  });

  function getSelectableItem() {
    return view.$(SelectableItem<string>);
  }

  it('should create', () => {
    expect(selectableItem).toBeTruthy();
  });

  it('should have the correct input value', () => {
    expect(selectableItem.value()).toBe('test');
  });

  it('should have the correct default selected state', () => {
    expect(selectableItem.selected()).toBeFalsy();
  });

  it('should have the correct CSS classes when not selected', () => {
    const element = getSelectableItem();
    expect(element.classList.contains('opacity-60')).toBeTruthy();
    expect(element.classList.contains('bg-foreground')).toBeFalsy();
    expect(element.classList.contains('shadow-md')).toBeFalsy();
    expect(element.classList.contains('ring-1')).toBeFalsy();
    expect(element.classList.contains('ring-border')).toBeFalsy();
  });

  it('should have the correct CSS classes when selected', () => {
    selectable.activeIndex.set('test');
    view.detectChanges();

    const element = getSelectableItem();
    expect(element.classList.contains('opacity-60')).toBeFalsy();
    expect(element.classList.contains('bg-foreground')).toBeTruthy();
    expect(element.classList.contains('shadow-md')).toBeTruthy();
    expect(element.classList.contains('ring-1')).toBeTruthy();
    expect(element.classList.contains('ring-border')).toBeTruthy();
  });

  it('should call select method when clicked', () => {
    const selectSpy = jest.spyOn(selectableItem, 'select');
    const element = getSelectableItem();
    element.click();
    expect(selectSpy).toHaveBeenCalled();
  });

  it('should have the correct attributes', () => {
    const element = getSelectableItem();
    expect(element.getAttribute('role')).toBe('tab');
  });
});
