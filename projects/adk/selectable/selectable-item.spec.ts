import { Component, ModelSignal, signal } from '@angular/core';
import { render, RenderResult } from '@meeui/adk/test';
import { MeeSelectable } from './selectable';
import { MeeSelectableItem } from './selectable-item';

// Test host component
@Component({
  imports: [MeeSelectableItem],
  template: '<button meeSelectableItem [value]="testValue"></button>',
})
class TestHostComponent {
  testValue = 'test';
}

const SelectableStub: Partial<MeeSelectable<string>> = {
  activeIndex: signal(0) as unknown as ModelSignal<string | undefined>,
  setValue: jest.fn(),
};

describe('SelectableItem', () => {
  let view: RenderResult<TestHostComponent>;
  let selectableItem: MeeSelectableItem<string>;

  beforeEach(async () => {
    view = await render(TestHostComponent, [{ provide: MeeSelectable, useValue: SelectableStub }]);
    selectableItem = view.viewChild(MeeSelectableItem<string>);
    view.detectChanges();
  });

  function getSelectableItem() {
    return view.$0(MeeSelectableItem<string>);
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
