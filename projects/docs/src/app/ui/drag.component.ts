import { Component } from '@angular/core';
import { DragMove, Drag, DropDirective, DragHandle } from '@meeui/drag';
import { moveItemInArray } from '@meeui/drag/drop.directive';
import { Icon } from '@meeui/icon';
import { Heading } from '@meeui/typography';
import { provideIcons } from '@ng-icons/core';
import { lucideGripVertical } from '@ng-icons/lucide';

@Component({
  standalone: true,
  selector: 'app-drag',
  imports: [DragMove, DropDirective, Drag, Heading, DragHandle, Icon],
  providers: [provideIcons({ lucideGripVertical })],
  template: `
    <h4 meeHeader="sm" class="mb-b5">Drag and Drop</h4>
    <div class="flex h-96 w-96 items-center justify-center overflow-hidden bg-background">
      <div meeDragMove class="grid h-20 w-20 place-items-center border bg-foreground">Drag me</div>
    </div>

    <div meeDrop (orderChanged)="drop($event)" class="w-96 overflow-hidden rounded-base border">
      @for (item of todo; track item) {
        <div class="flex items-center border-b bg-foreground p-b2" meeDrag>
          <mee-icon meeDragHandle name="lucideGripVertical" class="mr-2 p-b" />
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

  drop(event: { previousIndex: number; currentIndex: number }) {
    moveItemInArray(this.todo, event.previousIndex, event.currentIndex);
  }
}
