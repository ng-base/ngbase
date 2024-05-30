import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { dialogPortal } from '@meeui/dialog';
import { AddComponent } from '../add.component';
import { Button } from '@meeui/button';

@Component({
  standalone: true,
  selector: 'app-dialog',
  imports: [FormsModule, Heading, Button],
  template: `
    <h4 meeHeader class="mb-5" id="dialogPage">Dialog</h4>
    <button meeButton (click)="open()">submit</button>
  `,
})
export class DialogComponent {
  dialogPortal = dialogPortal();

  open() {
    this.dialogPortal.open(AddComponent, {
      width: '600px',
      maxHeight: '80vh',
      title: 'Add',
    });
  }
}
