import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { sheetPortal } from '@meeui/sheet';
import { AddComponent } from '../add.component';
import { Button } from '@meeui/button';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-sheet',
  imports: [FormsModule, Button, Heading, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="sheetPage">Sheet</h4>

    <app-doc-code [tsCode]="tsCode">
      <button meeButton (click)="open()">Open sheet</button>
    </app-doc-code>
  `,
})
export class SheetComponent {
  sheetPortal = sheetPortal();

  tsCode = `
  import { Component } from '@angular/core';
  import { sheetPortal } from '@meeui/sheet';

  @Component({
    standalone: true,
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
