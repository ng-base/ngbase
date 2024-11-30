import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '@meeui/ui/button';
import { drawerPortal } from '@meeui/ui/drawer';
import { Heading } from '@meeui/ui/typography';
import { AddComponent } from '../add.component';
import { DocCode } from './code.component';

@Component({
  selector: 'app-drawer',
  imports: [FormsModule, Heading, Button, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="drawerPage">Drawer</h4>

    <app-doc-code [tsCode]="tsCode">
      <button meeButton (click)="open()">Open drawer</button>
    </app-doc-code>
  `,
})
export class DrawerComponent {
  drawerPortal = drawerPortal();

  tsCode = `
  import { Component } from '@angular/core';
  import { drawerPortal } from '@meeui/ui/drawer';
  import { AddComponent } from '../add.component';

  @Component({
    selector: 'app-root',
    template: \`<button (click)="open()">Open drawer</button>\`,
  })
  export class AppComponent {
    drawerPortal = drawerPortal();

    open() {
      this.drawerPortal.open(AddComponent, {
        width: '80vw',
        title: 'Add',
        backdropColor: false,
      });
    }
  }
  `;

  open() {
    this.drawerPortal.open(AddComponent, {
      width: '80vw',
      title: 'Add',
      backdropColor: false,
    });
  }
}
