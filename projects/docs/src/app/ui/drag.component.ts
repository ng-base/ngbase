import { Component, signal } from '@angular/core';
import {
  DragMove,
  Drag,
  DragDrop,
  moveItemInArray,
  transferArrayItem,
  DropEvent,
} from '@meeui/drag';
import { Heading } from '@meeui/typography';
import { provideIcons } from '@ng-icons/core';
import { lucideGripVertical } from '@ng-icons/lucide';

@Component({
  standalone: true,
  selector: 'app-drag',
  imports: [DragDrop, Drag, DragMove, Heading],
  providers: [provideIcons({ lucideGripVertical })],
  template: `
    <h4 meeHeader="sm" class="mb-b5">Drag and Drop</h4>
    <div class="parent flex h-96 w-96 items-center justify-center border bg-background">
      <div
        meeDragMove
        dragBoundary=".parent"
        class="grid h-20 w-20 place-items-center border bg-foreground"
      >
        Drag me
      </div>
    </div>

    <!-- <div class="flex gap-b4">
      <div meeDrop (orderChanged)="drop($event)" class="drop-list mt-10 w-96 rounded-base border">
        @for (item of dragItems; track item) {
          <div class="flex items-center border-b bg-foreground p-b2" meeDrag>
            <mee-icon meeDragHandle name="lucideGripVertical" class="mr-2 p-b" />
            {{ item }}
          </div>
        }
      </div>
    </div> -->
    <div class="flex gap-b4">
      <div class="drop-list mt-10 w-96 rounded-base border">
        <h4 meeHeader="sm" class="m-b2">To do</h4>
        <div meeDrop (orderChanged)="todoDrop($event)">
          @for (item of todo(); track item) {
            <div class="flex items-center border-b bg-foreground p-b2" meeDrag>
              {{ item }}
            </div>
          }
        </div>
      </div>

      <div class="drop-list mt-10 w-96 rounded-base border">
        <h4 meeHeader="sm" class="m-b2">Done</h4>
        <div meeDrop (orderChanged)="doneDrop($event)">
          @for (item of done(); track item) {
            <div class="flex items-center border-b bg-foreground p-b2" meeDrag>
              {{ item }}
            </div>
          }
        </div>
      </div>
    </div>

    <!-- horizontal drag -->
    <div
      meeDrop
      (orderChanged)="gridDrop($event)"
      class="drop-parent mt-10 inline-flex rounded-base border"
    >
      @for (item of grid; track item) {
        <div
          class="flex h-9 w-9 items-center justify-center border-r bg-foreground p-b2"
          meeDrag
          dragBoundary=".drop-parent"
        >
          {{ item }}
        </div>
      }
    </div>

    <div
      meeDrop
      (orderChanged)="gridDrop($event)"
      class="drop-parent-1 mt-10 grid w-96 grid-cols-3 rounded-base border"
    >
      @for (item of grid; track item) {
        <div
          class="flex items-center border-b bg-foreground p-b2"
          meeDrag
          dragBoundary=".drop-parent-1"
        >
          {{ item }}
        </div>
      }
    </div>
  `,
})
export class DragComponent {
  dragItems = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi',
    'Episode IX – The Rise of Skywalker',
  ];

  todo = signal(['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep']);

  done = signal(['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog']);

  grid = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  drop(event: DropEvent<string[]>) {
    console.log(event);
    moveItemInArray(this.dragItems, event.previousIndex, event.currentIndex);
  }

  gridDrop(event: DropEvent<string[]>) {
    console.log(event);
    moveItemInArray(this.grid, event.previousIndex, event.currentIndex);
  }

  todoDrop(event: DropEvent<string[]>) {
    console.log(event);
    const todoItems = [...this.todo()];
    const doneItems = [...this.done()];
    if (event.previousContainer.data === event.container.data) {
      console.log('same', event);
      moveItemInArray(todoItems, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(doneItems, todoItems, event.previousIndex, event.currentIndex);
      this.done.set(doneItems);
    }
    this.todo.set(todoItems);
  }

  doneDrop(event: DropEvent<string[]>) {
    console.log(event.container.data);
    const todoItems = [...this.todo()];
    const doneItems = [...this.done()];
    if (event.previousContainer.data === event.container.data) {
      moveItemInArray(doneItems, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(todoItems, doneItems, event.previousIndex, event.currentIndex);
      this.todo.set(todoItems);
    }
    this.done.set(doneItems);
  }
}
