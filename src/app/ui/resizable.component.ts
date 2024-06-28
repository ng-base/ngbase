import { Component, OnInit, signal } from '@angular/core';
import { ResizableGroup, Resizable } from '@meeui/resizable';
import { Heading } from '@meeui/typography';
import { Button } from '@meeui/button';

@Component({
  standalone: true,
  selector: 'app-resizable',
  imports: [Resizable, ResizableGroup, Heading, Button],
  template: `
    <h4 meeHeader class="mb-5" id="resizablePage">Resizable</h4>
    <button meeButton (click)="toggle()" class="mb-5">Toggle</button>
    <button meeButton (click)="toggleThird()" class="mb-5">Toggle Third</button>
    <mee-resizable-group class="rounded-lg border">
      <mee-resizable [size]="show() ? '270px' : 0">
        <div class="flex h-[200px] w-full items-center justify-center">
          Resizable 1
        </div>
      </mee-resizable>
      <mee-resizable>
        <div class="flex h-[200px] w-full items-center justify-center">
          Resizable 2
        </div>
        <!-- <mee-resizable-group class="h-full" direction="vertical">
          <mee-resizable [size]="50">
            <div class="flex h-full w-full items-center justify-center">
              Resizable 2
            </div>
          </mee-resizable>
          <mee-resizable [size]="50">
            <div class="flex h-full w-full items-center justify-center">
              Resizable 3
            </div>
          </mee-resizable>
        </mee-resizable-group> -->
      </mee-resizable>
      @if (showThird()) {
        <mee-resizable [size]="20">
          <div class="flex h-[200px] w-full items-center justify-center">
            Resizable 4
          </div>
        </mee-resizable>
      }
    </mee-resizable-group>
  `,
})
export class ResizableComponent implements OnInit {
  show = signal(true);
  showThird = signal(true);

  constructor() {}

  ngOnInit() {}

  toggle() {
    this.show.set(!this.show());
  }

  toggleThird() {
    this.showThird.set(!this.showThird());
  }
}
