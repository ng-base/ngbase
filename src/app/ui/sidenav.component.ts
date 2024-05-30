import { Component, signal } from '@angular/core';
import { Sidenav, SidenavContent, SidenavHeader } from '@meeui/sidenav';
import { Button } from '@meeui/button';

@Component({
  standalone: true,
  selector: 'app-sidenav',
  imports: [Sidenav, SidenavHeader, SidenavContent, Button],
  template: `
    <mee-sidenav [show]="show()" class="min-h-64">
      <mee-sidenav-header class="h-full w-40 border border-border">
        <div class="p-2">This is the header</div>
      </mee-sidenav-header>
      <mee-sidenav-content class="h-full border border-border p-2">
        <p>This is the content</p>
        <button meeButton (click)="toggle()">Toggle</button>
      </mee-sidenav-content>
    </mee-sidenav>
  `,
})
export class SidenavComponent {
  show = signal(true);

  toggle() {
    this.show.update((show) => !show);
  }
}
