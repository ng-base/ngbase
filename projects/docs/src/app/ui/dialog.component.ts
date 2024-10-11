import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { dialogPortal } from '@meeui/dialog';
import { AddComponent } from '../add.component';
import { Button } from '@meeui/button';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-dialog',
  imports: [FormsModule, Heading, Button, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="dialogPage">Dialog</h4>
    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
      <button meeButton (click)="open()">submit</button>
    </app-doc-code>
  `,
})
export class DialogComponent {
  dialogPortal = dialogPortal();

  htmlCode = `
      <button (click)="open()">submit</button>
    `;

  tsCode = `
  import { Component } from '@angular/core';
  import { dialogPortal } from '@meeui/dialog';
  import { AddComponent } from '../add.component';

  @Component({
    standalone: true,
    selector: 'app-root',
    template: \`${this.htmlCode}\`,
  })
  export class AppComponent {
    dialogPortal = dialogPortal();

    open() {
      this.dialogPortal.open(AddComponent, {
        width: '600px',
        maxHeight: '80vh',
        title: 'Add',
      });
    }
  }
  `;

  open() {
    this.dialogPortal.open(AddComponent, {
      width: '600px',
      maxHeight: '80vh',
      title: 'Add',
      fullWindow: true,
    });
  }
}
