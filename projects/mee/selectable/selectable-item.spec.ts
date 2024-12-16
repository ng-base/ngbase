import { Component, ModelSignal, signal } from '@angular/core';
import { MeeSelectable, MeeSelectableItem } from '@meeui/adk/selectable';
import { render, RenderResult } from '@meeui/adk/test';
import { Selectable, SelectableItem } from './selectable';

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
  let selectableItem: MeeSelectableItem<string>;
  let selectable: MeeSelectable<string>;

  beforeEach(async () => {
    view = await render(TestHostComponent, [{ provide: MeeSelectable, useValue: SelectableStub }]);
    selectable = view.inject(MeeSelectable<string>);
    selectableItem = view.viewChild(MeeSelectableItem<string>);
    view.detectChanges();
  });

  function getSelectableItem() {
    return view.$0(SelectableItem<string>);
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
    expect(element.hasClass('opacity-60')).toBeTruthy();
    expect(element.hasClass('bg-foreground', 'shadow-md', 'ring-1', 'ring-border')).toBeFalsy();
  });

  it('should have the correct CSS classes when selected', () => {
    selectable.activeIndex.set('test');
    view.detectChanges();

    const element = getSelectableItem();
    expect(element.hasClass('opacity-60')).toBeFalsy();
    expect(element.hasClass('bg-foreground', 'shadow-md', 'ring-1', 'ring-border')).toBeTruthy();
  });

  it('should call select method when clicked', () => {
    const selectSpy = jest.spyOn(selectableItem, 'select');
    const element = getSelectableItem();
    element.el.click();
    expect(selectSpy).toHaveBeenCalled();
  });

  it('should have the correct attributes', () => {
    const element = getSelectableItem();
    expect(element.attr('role')).toBe('tab');
  });
});
