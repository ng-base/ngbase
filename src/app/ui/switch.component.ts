import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { Switch } from '@meeui/switch';

@Component({
  standalone: true,
  selector: 'app-switch',
  imports: [FormsModule, Heading, Switch],
  template: `
    <h4 meeHeader class="mb-5" id="switchPage">Switch</h4>
    <mee-switch class="w-full" [(ngModel)]="switch">Switch the UI</mee-switch>
  `,
})
export class SwitchComponent {
  switch = false;
}
