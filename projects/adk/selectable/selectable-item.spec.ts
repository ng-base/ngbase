import { Component, ModelSignal, signal } from '@angular/core';
import { render, RenderResult } from '@ngbase/adk/test';
import { NgbSelectable } from './selectable';
import { NgbSelectableItem } from './selectable-item';

// Test host component
@Component({
  imports: [NgbSelectableItem],
  template: '<button ngbSelectableItem [value]="testValue"></button>',
})
class TestHostComponent {
  testValue = 'test';
}

const SelectableStub: Partial<NgbSelectable<string>> = {
  activeIndex: signal(0) as unknown as ModelSignal<string | undefined>,
  setValue: jest.fn(),
};

describe('SelectableItem', () => {
  let view: RenderResult<TestHostComponent>;
  let selectableItem: NgbSelectableItem<string>;

  beforeEach(async () => {
    view = await render(TestHostComponent, [{ provide: NgbSelectable, useValue: SelectableStub }]);
    selectableItem = view.viewChild(NgbSelectableItem<string>);
    view.detectChanges();
  });

  function getSelectableItem() {
    return view.$(NgbSelectableItem<string>);
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
