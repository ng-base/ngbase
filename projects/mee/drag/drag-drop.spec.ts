import { Component, DebugElement } from '@angular/core';
import { render, RenderResult } from '@meeui/ui/test';
import { Drag, DragData } from './drag';
import { DragDrop, moveItemInArray } from './drag-drop';

@Component({
  imports: [DragDrop, Drag],
  template: `
    <div meeDrop (orderChanged)="onOrderChanged($event)">
      @for (item of items; track item) {
        <div meeDrag>{{ item }}</div>
      }
    </div>
  `,
})
class TestComponent {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  onOrderChanged(event: { previousIndex: number; currentIndex: number }) {}
}

describe('DropDirective', () => {
  let component: TestComponent;
  let view: RenderResult<TestComponent>;
  let dropDirective: DragDrop<string[]>;
  let dragItems: DebugElement[];

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.host;
    view.detectChanges();

    dropDirective = view.viewChild(DragDrop<string[]>);
    dragItems = view.viewChildrenDebug(Drag);
  });

  function drag(data: Partial<DragData>, index: number) {
    dropDirective['onDrag'](data as DragData, dragItems[index].injector.get(Drag));
  }

  it('should create an instance', () => {
    expect(dropDirective).toBeTruthy();
  });

  it('should initialize sortableElements with the correct number of items', () => {
    expect(dropDirective['sortableElements'].length).toBe(4);
  });

  it('should update sortableElements when items change', () => {
    component.items.push('Item 5');
    view.detectChanges();
    expect(dropDirective['sortableElements'].length).toBe(5);
  });

  it('should set correct styles on drag start', () => {
    drag({ type: 'start', x: 0, y: 0 }, 0);
    expect(dragItems[0].nativeElement.style.zIndex).toBe('1000');
    expect(dragItems[0].nativeElement.style.transition).toBe('none');
    expect(dragItems[0].nativeElement.style.position).toBe('relative');
  });

  // TODO: fix this
  xit('should not change the order when start and end are the same', () => {
    // First move the first item to the second position
    jest.spyOn(component, 'onOrderChanged');
    drag({ type: 'start', x: 0, y: 0 }, 0);
    drag({ type: 'move', x: 0, y: 100 }, 0);
    drag({ type: 'end', x: 0, y: 100 }, 0);
    expect(component.onOrderChanged).toHaveBeenCalledTimes(1);

    // Now only trigger start and end
    drag({ type: 'start', x: 0, y: 0 }, 0);
    drag({ type: 'end', x: 0, y: 0 }, 0);
    expect(component.onOrderChanged).toHaveBeenCalledTimes(1);
  });

  it('should update element position on drag move', () => {
    drag({ type: 'start', x: 0, y: 0 }, 0);
    drag({ type: 'move', x: 0, y: 50 }, 0);
    expect(dragItems[0].nativeElement.style.transform).toBe('translate(0px, 50px)');
  });

  // TODO: fix this
  xit('should rearrange items when dragged to a new position', () => {
    const initialOrder = dropDirective['sortableElements'].slice();
    drag({ type: 'start', x: 0, y: 0 }, 0);
    drag({ type: 'move', x: 0, y: 100 }, 0);
    expect(dropDirective['sortableElements']).not.toEqual(initialOrder);
  });

  // TODO: fix this
  xit('should emit order changed event on drag end', () => {
    jest.spyOn(component, 'onOrderChanged');
    drag({ type: 'start', x: 0, y: 0 }, 0);
    drag({ type: 'move', x: 0, y: 100 }, 0);
    drag({ type: 'end', x: 0, y: 100 }, 0);
    expect(component.onOrderChanged).toHaveBeenCalled();
  });

  it('should reset positions after drag end except the current one', () => {
    drag({ type: 'start', x: 0, y: 0 }, 0);
    dropDirective['height'] = 100;
    drag({ type: 'move', x: 0, y: 100 }, 0);
    drag({ type: 'end', x: 0, y: 100 }, 0);
    dropDirective['sortableElements'].forEach((el, index) => {
      if (index !== 1) {
        expect(el.style.transform).toBe('');
        expect(el.style.transition).toBe('');
      }
    });
  });

  it('should not rearrange items if new index is same as old index', () => {
    const initialOrder = dropDirective['sortableElements'].slice();
    dropDirective['rearrangeItems'](dragItems[0].injector.get(Drag), 0);
    expect(dropDirective['sortableElements']).toEqual(initialOrder);
  });

  it('should correctly move item in array', () => {
    const array = [1, 2, 3, 4, 5];
    moveItemInArray(array, 1, 3);
    expect(array).toEqual([1, 3, 4, 2, 5]);
  });

  it('should handle moving item to start of array', () => {
    const array = [1, 2, 3, 4, 5];
    moveItemInArray(array, 4, 0);
    expect(array).toEqual([5, 1, 2, 3, 4]);
  });

  it('should handle moving item to end of array', () => {
    const array = [1, 2, 3, 4, 5];
    moveItemInArray(array, 0, 4);
    expect(array).toEqual([2, 3, 4, 5, 1]);
  });
});
