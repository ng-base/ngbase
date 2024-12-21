import { Component, signal } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Resizable, ResizableGroup } from '@meeui/ui/resizable';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-resizable',
  imports: [Resizable, ResizableGroup, Heading, Button, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="resizablePage">Resizable</h4>
    <app-doc-code [tsCode]="tsCode">
      <button meeButton (click)="toggle()" class="mb-5">Toggle</button>
      <button meeButton (click)="toggleThird()" class="mb-5">Toggle Third</button>

      <mee-resizable-group class="!w-[600px] rounded-lg border bg-foreground">
        <mee-resizable [size]="show() ? '200px' : 0" min="50px">
          <div class="flex h-[200px] w-full items-center justify-center">1</div>
        </mee-resizable>
        @if (showThird()) {
          <mee-resizable size="150px" min="50px" max="200px">
            <div class="flex h-[200px] w-full items-center justify-center">2</div>
          </mee-resizable>
        }
        <mee-resizable>
          <div class="flex h-[200px] w-full items-center justify-center">3</div>
        </mee-resizable>
        <mee-resizable min="50px" max="150px">
          <div class="flex h-[200px] w-full items-center justify-center">4</div>
        </mee-resizable>
      </mee-resizable-group>
      <mee-resizable-group class="!w-[700px] rounded-lg border bg-foreground">
        <mee-resizable [size]="show() ? '100px' : 0">
          <div class="flex h-[200px] w-full items-center justify-center">1</div>
        </mee-resizable>
        <mee-resizable [size]="show() ? '80px' : 0" [min]="10" [max]="'160px'">
          <div class="flex h-[200px] w-full items-center justify-center">2</div>
        </mee-resizable>
        <mee-resizable [size]="show() ? '80px' : 0" [min]="10" [max]="'160px'">
          <div class="flex h-[200px] w-full items-center justify-center">3</div>
        </mee-resizable>
        <mee-resizable [size]="show() ? '80px' : 0" [min]="10" [max]="'160px'">
          <div class="flex h-[200px] w-full items-center justify-center">4</div>
        </mee-resizable>
        <mee-resizable>
          <mee-resizable-group class="h-full" direction="vertical">
            <mee-resizable [size]="50">
              <div class="flex h-full w-full items-center justify-center">5</div>
            </mee-resizable>
            <mee-resizable [size]="50">
              <mee-resizable-group class="h-full">
                <mee-resizable [size]="50" [min]="'25px'">
                  <div class="flex h-full w-full items-center justify-center">1</div>
                </mee-resizable>
                <mee-resizable [size]="50" [min]="'25px'">
                  <div class="flex h-full w-full items-center justify-center">2</div>
                </mee-resizable>
              </mee-resizable-group>
            </mee-resizable>
          </mee-resizable-group>
        </mee-resizable>
        @if (showThird()) {
          <mee-resizable [size]="30">
            <div class="flex h-[200px] w-full items-center justify-center">6</div>
          </mee-resizable>
        }
      </mee-resizable-group>
    </app-doc-code>
  `,
})
export default class ResizableComponent {
  show = signal(true);
  showThird = signal(true);

  tsCode = `
  import { Component } from '@angular/core';
  import { ResizableGroup, Resizable } from '@meeui/ui/resizable';
  import { Button } from '@meeui/ui/button';

  @Component({
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
