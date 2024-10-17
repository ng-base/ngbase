import { Directive, contentChildren, output, effect } from '@angular/core';
import { Drag, DragData } from './drag';

@Directive({
  standalone: true,
  selector: '[meeDrop]',
})
export class DragDrop {
  readonly dragItems = contentChildren(Drag);
  readonly orderChanged = output<{ previousIndex: number; currentIndex: number }>();

  private sortableElements: HTMLElement[] = [];
  private previousIndex!: number;
  private currentIndex!: number;
  private height!: number; // height is required for testing

  constructor() {
    effect(cleanup => {
      const items = this.dragItems();
      this.sortableElements = [];
      const subs = items.map((item, index) => {
        this.sortableElements.push(item.el.nativeElement);
        return item.meeDrag.subscribe(data => this.onDrag(data, item, index));
      });
      cleanup(() => subs.forEach(sub => sub.unsubscribe()));
    });
  }

  private onDrag(dragData: DragData, item: Drag, index: number) {
    const element = item.el.nativeElement;
    if (dragData.type === 'start') {
      this.onDragStart(element);
    } else if (dragData.type === 'move') {
      this.onDragMove(element, dragData, item, index);
    } else if (dragData.type === 'end') {
      this.onDragEnd(element);
    }
  }

  private onDragStart(element: HTMLElement) {
    element.style.zIndex = '1000';
    element.style.transition = 'none';
    element.style.position = 'relative';

    // original index
    this.previousIndex = this.dragItems().findIndex(item => item.el.nativeElement === element);
    this.height = element.offsetHeight;
  }

  private onDragMove(element: HTMLElement, dragData: DragData, drag: Drag, index: number) {
    const deltaX = dragData.x;
    const deltaY = dragData.y;
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    let newIndex = index + Math.round(deltaY / this.height);
    newIndex = Math.max(0, Math.min(newIndex, this.sortableElements.length - 1));

    if (newIndex !== this.currentIndex) {
      this.rearrangeItems(drag, newIndex);
      this.currentIndex = newIndex;
    }
  }

  private onDragEnd(element: HTMLElement) {
    // Emit the new order
    this.resetPositions();
    this.emitNewOrder();

    element.style.transition = 'transform 0.3s ease-out';
    element.addEventListener(
      'transitionend',
      () => {
        element.style.zIndex = '';
    element.style.position = '';
  }

  private rearrangeItems(dragger: Drag, newIndex: number) {
    const draggedItem = dragger.el.nativeElement;
    const oldIndex = this.sortableElements.indexOf(draggedItem);
    if (oldIndex === newIndex) return;

    // Move the dragged item in the array
    this.sortableElements.splice(oldIndex, 1);
    this.sortableElements.splice(newIndex, 0, draggedItem);

    // Update positions of all items
    this.updateItemPositions(draggedItem, newIndex);
  }

  private updateItemPositions(draggedItem: HTMLElement, newIndex: number) {
    const originalIndex = this.previousIndex;
    this.sortableElements.forEach((el, index) => {
      if (el !== draggedItem) {
        const v =
          (originalIndex >= newIndex && (index > originalIndex || index < newIndex)) ||
          (originalIndex <= newIndex && (index < originalIndex || index > newIndex))
            ? 0
            : index > newIndex
              ? 1
              : -1;
        const shift = v * this.height;
        el.style.transform = `translateY(${shift}px)`;
        el.style.transition = 'transform 0.3s ease-out';
      }
    });
  }

  private resetPositions() {
    this.sortableElements.forEach(el => {
      el.style.transform = '';
      el.style.transition = '';
    });
  }

  private emitNewOrder() {
    if (this.currentIndex !== this.previousIndex) {
      this.orderChanged.emit({
        previousIndex: this.previousIndex,
        currentIndex: this.currentIndex,
      });
    }
  }
}

export function moveItemInArray<T>(array: T[], fromIndex: number, toIndex: number): void {
  if (fromIndex === toIndex) return;

  const item = array[fromIndex];
  const diff = fromIndex - toIndex;

  if (diff > 0) {
    // Moving towards the start of the array
    for (let i = fromIndex; i > toIndex; i--) {
      array[i] = array[i - 1];
    }
  } else {
    // Moving towards the end of the array
    for (let i = fromIndex; i < toIndex; i++) {
      array[i] = array[i + 1];
    }
  }

  array[toIndex] = item;
}

export function transferArrayItem<T>(
  fromArray: T[],
  toArray: T[],
  fromIndex: number,
  toIndex: number,
): void {
  const item = fromArray[fromIndex];
  fromArray.splice(fromIndex, 1);
  toArray.splice(toIndex, 0, item);
}
