import { Component } from '@angular/core';
import { Command } from '@meeui/command';
import { dialogPortal } from '@meeui/dialog';
import { keyMap } from '@meeui/keys';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-command',
  template: ``,
})
export class CommandComponent {
  dialog = dialogPortal();

  constructor() {
    keyMap('ctrl+k', () => this.open());
  }

  open() {
    this.dialog.open(Command, {
      header: true,
      width: '600px',
      minHeight: '400px',
      maxHeight: '500px',
    });
  }
}
