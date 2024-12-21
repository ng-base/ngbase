import { Component, signal } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Sidenav, SidenavHeader } from '@meeui/ui/sidenav';
import { DocCode } from './code.component';

@Component({
  selector: 'app-sidenav',
  imports: [Sidenav, SidenavHeader, Button, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="sidenavPage">Sidenav</h4>

    <app-doc-code [tsCode]="tsCode">
      <mee-sidenav [show]="show()" class="min-h-64 !w-96 rounded-base border bg-foreground">
        <mee-sidenav-header class="h-full w-40">
          <div class="p-2">This is the header</div>
        </mee-sidenav-header>
        <div class="h-full border p-2">
          <p>This is the content</p>
          <button meeButton (click)="toggle()">Toggle</button>
        </div>
      </mee-sidenav>
    </app-doc-code>
  `,
})
export default class SidenavComponent {
  show = signal(true);

  tsCode = `
  import { Component } from '@angular/core';
  import { Sidenav, SidenavHeader, SidenavContent } from '@meeui/ui/sidenav';
  import { Button } from '@meeui/ui/button';

  @Component({
    selector: 'app-root',
    imports: [Sidenav, SidenavHeader, SidenavContent, Button],
    template: \`
      <mee-sidenav [show]="show()" class="min-h-64">
        <mee-sidenav-header class="h-full w-40 border">
          <div class="p-2">This is the header</div>
        </mee-sidenav-header>
        <mee-sidenav-content class="h-full border p-2">
          <p>This is the content</p>
          <button meeButton (click)="toggle()">Toggle</button>
        </mee-sidenav-content>
      </mee-sidenav>
    \`
  })
  export class AppComponent {
    show = signal(true);

    toggle() {
      this.show.update(show => !show);
    }
  }
  `;

  toggle() {
    this.show.update(show => !show);
  }
}
