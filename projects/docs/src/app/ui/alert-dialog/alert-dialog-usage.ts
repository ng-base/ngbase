import { Component } from '@angular/core';
import { alertPortal } from '@meeui/ui/alert';

@Component({
  selector: 'app-root',
  template: `<button (click)="openAlert()">Open alert</button>`,
})
export class AppComponent {
  alert = alertPortal();

  openAlert() {
    this.alert.open({
      title: 'Are you absolutely sure?',
      description: `This alert cannot be dismissed using the "esc" key or touching the "backdrop".
                      Select any option to close the alert.`,
      actions: [
        { text: 'Cancel', type: 'ghost', handler: close => close() },
        { text: 'Continue', handler: close => close() },
      ],
    });
  }
}
