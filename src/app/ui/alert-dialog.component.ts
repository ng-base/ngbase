import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { alertPortal } from '@meeui/alert';
import { Button } from '@meeui/button';

@Component({
  standalone: true,
  selector: 'app-alert-dialog',
  imports: [FormsModule, Heading, Button],
  template: `
    <h4 meeHeader class="mb-5" id="alertDialogPage">Alert Dialog</h4>
    <button meeButton (click)="openAlert()">Open alert</button>
  `,
})
export class AlertDialogComponent {
  alert = alertPortal();

  openAlert() {
    this.alert.open({
      title: 'Are you absolutely sure?',
      description: `This alert cannot be dismissed using the "esc" key or touching the "backdrop". Select any option to close the alert.`,
      actions: [
        { text: 'Cancel', type: 'ghost', handler: (close) => close() },
        { text: 'Continue', handler: (close) => close() },
      ],
    });
  }
}
