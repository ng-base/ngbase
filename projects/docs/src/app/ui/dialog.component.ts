import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '@meeui/ui/button';
import { dialogPortal } from '@meeui/ui/dialog';
import { Heading } from '@meeui/ui/typography';
import { AddComponent } from '../add.component';
import { DocCode } from './code.component';

@Component({
  selector: 'app-dialog',
  imports: [FormsModule, Heading, Button, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="dialogPage">Dialog</h4>
    <app-doc-code [tsCode]="tsCode">
      <button meeButton (click)="open()">submit</button>
    </app-doc-code>
  `,
})
export class DialogComponent {
  dialogPortal = dialogPortal();

  tsCode = `
  import { Component } from '@angular/core';
  import { dialogPortal } from '@meeui/ui/dialog';
  import { AddComponent } from '../add.component';

  @Component({
    selector: 'app-root',
    template: \`<button (click)="open()">submit</button>\`,
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
