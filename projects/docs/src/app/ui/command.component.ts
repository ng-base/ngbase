import { Component } from '@angular/core';
import { Command } from '@meeui/ui/command';
import { dialogPortal } from '@meeui/ui/dialog';
import { keyMap } from '@meeui/ui/keys';

@Component({
  standalone: true,
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
