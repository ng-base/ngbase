import { Component } from '@angular/core';
import { Command } from '@meeui/ui/command';
import { dialogPortal } from '@meeui/ui/dialog';
import { keyMap } from '@meeui/adk/keys';

@Component({
  selector: 'app-command',
  template: ``,
})
export default class CommandComponent {
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
