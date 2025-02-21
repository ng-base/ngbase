import { contentChildren, Directive } from '@angular/core';
import { DragDrop } from './drag-drop';

@Directive({
  selector: '[ngbDropGroup]',
  host: {
    class: 'drop-group',
  },
})
export class DropGroup<T> {
  readonly drops = contentChildren(DragDrop<T>);
  private currentDrop: DragDrop<T> | null = null;
  private previousDrop: DragDrop<T> | null = null;

  onStart(drop: DragDrop<T>) {
    this.previousDrop = drop;
    this.currentDrop = drop;
  }

  // onDragMove(data: T) {
  //   if (this.currentDrop?.fromThis(data)) {
  //     return;
  //   }
  //   const drop = this.drops().find(drop => drop.fromThis(data));
  //   if (drop) {
  //     this.currentDrop = drop;
  //   }
  // }
}
