import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { render, RenderResult } from '@meeui/adk/test';
import { MeeSelectable } from './selectable';
import { MeeSelectableItem } from './selectable-item';

@Component({
  imports: [MeeSelectable, MeeSelectableItem, FormsModule],
  template: `
    <div meeSelectable [(ngModel)]="selectedValue">
      <div meeSelectableItem [value]="1">Item 1</div>
      <div meeSelectableItem [value]="2">Item 2</div>
      <div meeSelectableItem [value]="3">Item 3</div>
    </div>
  `,
})
class TestHostComponent {
  selectedValue: number | null = null;
}

describe('Selectable', () => {
  let view: RenderResult<TestHostComponent>;
  let selectable: MeeSelectable<number>;

  beforeEach(async () => {
    view = await render(TestHostComponent);
    selectable = view.viewChild(MeeSelectable<number>);
    view.detectChanges();
  });

  it('should create', () => {
    expect(selectable).toBeTruthy();
  });

  function selectableItems() {
    return view.viewChildren(MeeSelectableItem);
  }

  it('should have three selectable items', () => {
    expect(selectableItems().length).toBe(3);
  });

  it('should set active index when a value is written', () => {
    selectable.writeValue(2);
    expect(selectable.activeIndex()).toBe(2);
  });

  it('should update selected state of items when active index changes', () => {
    selectable.writeValue(2);
    view.detectChanges();

    const items = selectableItems();
    expect(items[0].selected()).toBeFalsy();
    expect(items[1].selected()).toBeTruthy();
    expect(items[2].selected()).toBeFalsy();
  });

  it('should call onChange and emit valueChanged when setValue is called', () => {
    const onChangeSpy = jest.fn();
    const valueChangedSpy = jest.spyOn(selectable.valueChanged, 'emit');

    selectable.registerOnChange(onChangeSpy);
    selectable.setValue(3);

    expect(onChangeSpy).toHaveBeenCalledWith(3);
    expect(valueChangedSpy).toHaveBeenCalledWith(3);
  });

  it('should update model value when an item is selected', () => {
    const items = selectableItems();
    items[1].select();
    view.detectChanges();

    expect(view.host.selectedValue).toBe(2);
  });

  it('should call onTouched when setValue is called', () => {
    const onTouchedSpy = jest.fn();
    selectable.registerOnTouched(onTouchedSpy);

    selectable.setValue(1);

    expect(onTouchedSpy).toHaveBeenCalled();
  });
});
