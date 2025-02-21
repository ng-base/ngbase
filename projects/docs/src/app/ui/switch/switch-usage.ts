import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Switch } from '@meeui/ui/switch';

@Component({
  selector: 'app-switch',
  imports: [Switch, FormsModule],
  template: ` <mee-switch [(ngModel)]="switch">Switch the UI</mee-switch> `,
})
export class SwitchComponent {
  switch = false;
}
