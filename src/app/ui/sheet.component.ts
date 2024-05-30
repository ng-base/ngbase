import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { sheetPortal } from '@meeui/sheet';
import { AddComponent } from '../add.component';
import { Button } from '@meeui/button';

@Component({
  standalone: true,
  selector: 'app-sheet',
  imports: [FormsModule, Button, Heading],
  template: `
    <h4 meeHeader class="mb-5" id="sheetPage">Sheet</h4>
    <button meeButton (click)="open()">Open sheet</button>
  `,
})
export class SheetComponent {
  sheetPortal = sheetPortal();

  open() {
    this.sheetPortal.open(AddComponent, {
      width: '25rem',
      title: 'Add',
    });
  }
}
