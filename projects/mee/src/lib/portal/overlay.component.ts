import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'div[meeOverlay]',
  template: ``,
  host: {
    class: 'mee-overlay',
    '(click)': 'close()',
  },
})
export class Overlay {
  close() {
    console.log('overlay closed');
  }
}
