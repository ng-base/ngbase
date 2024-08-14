import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { drawerPortal } from '@meeui/drawer';
import { AddComponent } from '../add.component';
import { Button } from '@meeui/button';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-drawer',
  imports: [FormsModule, Heading, Button, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="drawerPage">Drawer</h4>

    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
      <button meeButton (click)="open()">Open drawer</button>
    </app-doc-code>
  `,
})
export class DrawerComponent {
  drawerPortal = drawerPortal();

  htmlCode = `
      <button (click)="open()">Open drawer</button>
    `;

  tsCode = `
  import { Component } from '@angular/core';
  import { drawerPortal } from '@meeui/drawer';
  import { AddComponent } from '../add.component';

  @Component({
    standalone: true,
    selector: 'app-root',
    template: \`${this.htmlCode}\`,
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
