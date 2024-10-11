import { Component } from '@angular/core';
import { Selectable } from './selectable.component';
import { SelectableItem } from './selectable-item.component';
import { FormsModule } from '@angular/forms';
import { render, RenderResult } from '../test';

@Component({
  standalone: true,
  imports: [Selectable, SelectableItem, FormsModule],
  template: `
    <mee-selectable [(ngModel)]="selectedValue">
      <mee-selectable-item [value]="1">Item 1</mee-selectable-item>
      <mee-selectable-item [value]="2">Item 2</mee-selectable-item>
      <mee-selectable-item [value]="3">Item 3</mee-selectable-item>
    </mee-selectable>
  `,
})
class TestHostComponent {
  selectedValue: number | null = null;
}

describe('Selectable', () => {
  let view: RenderResult<TestHostComponent>;
  let selectable: Selectable<number>;

  beforeEach(async () => {
    view = await render(TestHostComponent);
    selectable = view.viewChild(Selectable<number>);
    view.detectChanges();
  });

  it('should create', () => {
    expect(selectable).toBeTruthy();
  });

  it('should have three selectable items', () => {
    expect(selectable.items().length).toBe(3);
  });

  it('should set active index when a value is written', () => {
    selectable.writeValue(2);
    expect(selectable.activeIndex()).toBe(2);
  });

  it('should update selected state of items when active index changes', () => {
    selectable.writeValue(2);
    view.detectChanges();

    const items = selectable.items();
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
    const items = selectable.items();
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
