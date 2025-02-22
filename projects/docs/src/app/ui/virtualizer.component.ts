import { Component } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Heading } from '@meeui/ui/typography';
import { VirtualFor, Virtualizer } from '@ngbase/adk/virtualizer';

@Component({
  selector: 'app-root',
  imports: [Virtualizer, VirtualFor, Button, Heading],
  template: `
    <div>
      <div class="flex gap-2">
        <button meeButton (click)="vv.scrollToIndex(0)">Scroll to 0</button>
        <button meeButton (click)="vv.scrollToIndex(10)">Scroll to 10</button>
        <button meeButton (click)="vv.scrollToIndex(99999)">Scroll to 99999</button>
      </div>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <h4 meeHeader="sm" class="mt-4">Vertical</h4>
          <ngb-virtualizer #vv [itemSize]="50" class="h-[400px] border">
            <div
              *virtualFor="let item of items; let i = index"
              class="flex h-full items-center border-b px-4"
            >
              id: {{ item.id }} | name: {{ item.name }} | description: {{ item.description }} |
              value: {{ item.value }}
            </div>
          </ngb-virtualizer>
        </div>

        <div>
          <h4 meeHeader="sm" class="mt-4">Horizontal</h4>
          <ngb-virtualizer orientation="horizontal" [itemSize]="50" class="h-[400px] border">
            <div
              *virtualFor="let item of items; let i = index"
              class="flex h-full w-full items-center border-r py-4 [writing-mode:vertical-lr]"
            >
              Column {{ i }}
            </div>
          </ngb-virtualizer>
        </div>
      </div>
    </div>
  `,
})
export default class VirtualizerComponent {
  items = Array.from({ length: 100000 }).map((_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `Description ${i}`,
    value: i,
  }));
  constructor() {
    console.log('this.items');
  }
}
