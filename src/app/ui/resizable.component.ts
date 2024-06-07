import { Component, OnInit } from '@angular/core';
import { ResizableGroup, Resizable } from '@meeui/resizable';
import { Heading } from '@meeui/typography';

@Component({
  standalone: true,
  selector: 'app-resizable',
  imports: [Resizable, ResizableGroup, Heading],
  template: `
    <h4 meeHeader class="mb-5" id="resizablePage">Resizable</h4>
    <mee-resizable-group class="rounded-lg border">
      <mee-resizable [size]="30">
        <div class="flex h-[200px] w-full items-center justify-center">
          Resizable 1
        </div>
      </mee-resizable>
      <mee-resizable [size]="50">
        <mee-resizable-group class="h-full" direction="vertical">
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
        </mee-resizable-group>
      </mee-resizable>
      <mee-resizable [size]="20">
        <div class="flex h-[200px] w-full items-center justify-center">
          Resizable 4
        </div>
      </mee-resizable>
    </mee-resizable-group>
  `,
})
export class ResizableComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
