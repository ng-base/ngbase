import { Component } from '@angular/core';
import { Button } from '@meeui/button';
import { Heading } from '@meeui/typography';
import { VirtualFor, Virtualizer } from '@meeui/virutalizer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Virtualizer, VirtualFor, Button, Heading],
  template: `
    <div>
      <button meeButton (click)="vv.scrollToIndex(0)">Scroll to 0</button>
      <button meeButton (click)="vv.scrollToIndex(10)">Scroll to 10</button>
      <button meeButton (click)="vv.scrollToIndex(99999)">Scroll to 99999</button>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 meeHeader="sm" class="mt-4">Vertical</h4>
          <mee-virtualizer #vv [itemSize]="50" class="h-[400px] border">
            <div
              *virtualFor="let item of items; let i = index"
              class="flex h-full items-center border-b px-b4"
            >
              Row {{ i }}
            </div>
          </mee-virtualizer>
        </div>

        <div>
          <h4 meeHeader="sm" class="mt-4">Horizontal</h4>
          <mee-virtualizer #vv orientation="horizontal" [itemSize]="50" class="h-[400px] border">
            <div
              *virtualFor="let item of items; let i = index"
              class="flex h-full w-full items-center border-r py-b4 [writing-mode:vertical-lr]"
            >
              Column {{ i }}
            </div>
          </mee-virtualizer>
        </div>
      </div>
    </div>
  `,
})
export class VirtualizerComponent {
  items = Array.from({ length: 100000 }).map((_, i) => i);
  constructor() {
    console.log('this.items');
  }
}
