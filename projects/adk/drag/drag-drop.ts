import {
  Directive,
  ElementRef,
  contentChildren,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { Drag, DragData } from './drag';

export interface DropEvent<T> {
  previousIndex: number;
  currentIndex: number;
  container: { data: T };
  previousContainer: { data: T };
}

@Directive({
  selector: '[meeDrop]',
})
export class DragDrop<T> {
  readonly el = inject(ElementRef);
  readonly dragItems = contentChildren(Drag);

  readonly data = input<T>();
  readonly orderChanged = output<DropEvent<T>>();

  private sortableElements: HTMLElement[] = [];
  private previousIndex!: number;
  private currentIndex!: number;
  private height!: number; // height is required for testing

  constructor() {
    effect(cleanup => {
      const items = this.dragItems();
      this.sortableElements = [];
      const subs = items.map(item => {
        this.sortableElements.push(item.el.nativeElement);
        return item.meeDrag.subscribe(data => this.onDrag(data, item));
      });
      cleanup(() => subs.forEach(sub => sub.unsubscribe()));
    });
  }

  private onDrag(dragData: DragData, item: Drag) {
    const element = item.el.nativeElement;
    if (dragData.type === 'start') {
      this.onDragStart(element);
    } else if (dragData.type === 'move') {
      this.onDragMove(element, dragData, item);
    } else if (dragData.type === 'end') {
      this.onDragEnd(element);
    }
  }

  fromThis(dragData: DragData) {
    return isIntersecting(
      { x: dragData.clientX!, y: dragData.clientY!, w: 0.1, h: 0.1 },
      this.el.nativeElement.getBoundingClientRect(),
    );
  }

  private onDragStart(element: HTMLElement) {
    element.style.zIndex = '1000';
    element.style.transition = 'none';
    element.style.position = 'relative';

    // original index
    this.previousIndex = this.dragItems().findIndex(item => item.el.nativeElement === element);
    this.currentIndex = this.previousIndex;
    this.height = element.offsetHeight;
  }

  private onDragMove(element: HTMLElement, dragData: DragData, drag: Drag) {
    const deltaX = dragData.x;
    const deltaY = dragData.y;
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // we have to find the new index by checking clientXY of the mouse
    const mouseY = dragData.clientY!;
    const mouseX = dragData.clientX!;
    const ci = this.currentIndex ?? this.previousIndex;
    let newIndex = this.sortableElements.findIndex((el, index) => {
      const rect = el.getBoundingClientRect();
      return index !== ci && isIntersecting({ x: mouseX, y: mouseY, w: 0.1, h: 0.1 }, rect);
    });
    newIndex = newIndex === -1 ? ci : newIndex;

    if (newIndex !== this.currentIndex) {
      this.rearrangeItems(drag, newIndex);
      this.currentIndex = newIndex;
    }
  }

  private onDragEnd(element: HTMLElement) {
    // Emit the new order
    this.resetPositions();
    this.emitNewOrder();

    // element.style.transition = 'transform 0.3s ease-out';
    // element.addEventListener(
    //   'transitionend',
    //   () => {
    element.style.zIndex = '';
    element.style.position = '';
    // },
    // { once: true },
    // );
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
        // el.style.transition = 'transform 0.3s ease-out';
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
      const containerData = { data: this.data()! };
      this.orderChanged.emit({
        previousIndex: this.previousIndex,
        currentIndex: this.currentIndex,
        container: containerData,
        previousContainer: containerData,
      });
    }
  }
}

interface Boundary {
  x: number;
  y: number;
  w: number;
  h: number;
}

// We need to check if the mouse is intersecting with the element
function isIntersecting(rect1: Boundary | DOMRect, rect2: Boundary | DOMRect) {
  if (rect1 instanceof DOMRect) {
    rect1 = { x: rect1.x, y: rect1.y, w: rect1.width, h: rect1.height };
  }
  if (rect2 instanceof DOMRect) {
    rect2 = { x: rect2.x, y: rect2.y, w: rect2.width, h: rect2.height };
  }
  return (
    rect1.x <= rect2.x + rect2.w &&
    rect1.x + rect1.w >= rect2.x &&
    rect1.y <= rect2.y + rect2.h &&
    rect1.y + rect1.h >= rect2.y
  );
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
