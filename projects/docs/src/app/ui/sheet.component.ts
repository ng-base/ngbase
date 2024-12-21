import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '@meeui/ui/button';
import { sheetPortal } from '@meeui/ui/sheet';
import { Heading } from '@meeui/ui/typography';
import { AddComponent } from '../add.component';
import { DocCode } from './code.component';

@Component({
  selector: 'app-sheet',
  imports: [FormsModule, Button, Heading, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="sheetPage">Sheet</h4>

    <app-doc-code [tsCode]="tsCode">
      <button meeButton (click)="open()">Open sheet</button>
    </app-doc-code>
  `,
})
export default class SheetComponent {
  sheetPortal = sheetPortal();

  tsCode = `
  import { Component } from '@angular/core';
  import { sheetPortal } from '@meeui/ui/sheet';

  @Component({
    selector: 'app-root',
    template: \`
      <button (click)="open()">Open sheet</button>
    \`
  })
  export class AppComponent {
    sheetPortal = sheetPortal();

    open() {
      this.sheetPortal.open(AddComponent, {
        width: '25rem',
        title: 'Add',
      });
    }
  }
  `;

  open() {
    this.sheetPortal.open(AddComponent, {
      width: '25rem',
      title: 'Add',
    });
  }
}
