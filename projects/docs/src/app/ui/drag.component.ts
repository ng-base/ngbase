import { Component } from '@angular/core';
import { DragMove, Drag, DragDrop, DragHandle, moveItemInArray } from '@meeui/drag';
import { Icon } from '@meeui/icon';
import { Heading } from '@meeui/typography';
import { provideIcons } from '@ng-icons/core';
import { lucideGripVertical } from '@ng-icons/lucide';

@Component({
  standalone: true,
  selector: 'app-drag',
  imports: [DragMove, DragDrop, Drag, Heading, DragHandle, Icon],
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

    <div class="flex gap-b4">
      <div meeDrop (orderChanged)="drop($event)" class="drop-list mt-10 w-96 rounded-base border">
        @for (item of todo; track item) {
          <div class="flex items-center border-b bg-foreground p-b2" meeDrag>
            <mee-icon meeDragHandle name="lucideGripVertical" class="mr-2 p-b" />
            {{ item }}
          </div>
        }
      </div>
      <div meeDrop (orderChanged)="drop($event)" class="drop-list mt-10 w-96 rounded-base border">
        @for (item of todo; track item) {
          <div class="flex items-center border-b bg-foreground p-b2" meeDrag>
            <mee-icon meeDragHandle name="lucideGripVertical" class="mr-2 p-b" />
            {{ item }}
          </div>
        }
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
  todo = [
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

  grid = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  drop(event: { previousIndex: number; currentIndex: number }) {
    console.log(event);
    moveItemInArray(this.todo, event.previousIndex, event.currentIndex);
  }

  gridDrop(event: { previousIndex: number; currentIndex: number }) {
    console.log(event);
    moveItemInArray(this.grid, event.previousIndex, event.currentIndex);
  }
}
