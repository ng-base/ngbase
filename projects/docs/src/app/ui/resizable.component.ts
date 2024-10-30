import { Component, signal } from '@angular/core';
import { ResizableGroup, Resizable } from '@meeui/resizable';
import { Heading } from '@meeui/typography';
import { Button } from '@meeui/button';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-resizable',
  imports: [Resizable, ResizableGroup, Heading, Button, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="resizablePage">Resizable</h4>
    <app-doc-code [tsCode]="tsCode">
      <button meeButton (click)="toggle()" class="mb-5">Toggle</button>
      <button meeButton (click)="toggleThird()" class="mb-5">Toggle Third</button>

      <mee-resizable-group class="!w-96 rounded-lg border bg-foreground">
        <mee-resizable [size]="show() ? '140px' : 0">
          <div class="flex h-[200px] w-full items-center justify-center">Resizable 1</div>
        </mee-resizable>
        <mee-resizable>
          <!-- <div class="flex h-[200px] w-full items-center justify-center">Resizable 2</div> -->
          <mee-resizable-group class="h-full" direction="vertical">
            <mee-resizable [size]="50">
              <div class="flex h-full w-full items-center justify-center">Resizable 2</div>
            </mee-resizable>
            <mee-resizable [size]="50">
              <div class="flex h-full w-full items-center justify-center">Resizable 3</div>
            </mee-resizable>
          </mee-resizable-group>
        </mee-resizable>
        @if (showThird()) {
          <mee-resizable [size]="30">
            <div class="flex h-[200px] w-full items-center justify-center">Resizable 4</div>
          </mee-resizable>
        }
      </mee-resizable-group>
    </app-doc-code>
  `,
})
export class ResizableComponent {
  show = signal(true);
  showThird = signal(true);

  tsCode = `
  import { Component } from '@angular/core';
  import { signal } from '@meeui/utils';
  import { ResizableGroup, Resizable } from '@meeui/resizable';
  import { Button } from '@meeui/button';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [Resizable, ResizableGroup, Button],
    template: \`
      <mee-resizable-group class="rounded-lg border">
        <mee-resizable [size]="'270px'">
          <div class="flex h-[200px] w-full items-center justify-center">Resizable 1</div>
        </mee-resizable>
        <mee-resizable>
          <div class="flex h-[200px] w-full items-center justify-center">Resizable 2</div>
        </mee-resizable>
        @if (showThird()) {
          <mee-resizable [size]="20">
            <div class="flex h-[200px] w-full items-center justify-center">Resizable 4</div>
          </mee-resizable>
        }
      </mee-resizable-group>
    \`
  })
  export class AppComponent {}
  `;

  toggle() {
    this.show.set(!this.show());
  }

  toggleThird() {
    this.showThird.set(!this.showThird());
  }
}
