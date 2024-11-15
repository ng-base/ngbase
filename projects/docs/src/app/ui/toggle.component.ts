import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Toggle } from '@meeui/ui/toggle';
import { Heading } from '@meeui/ui/typography';

@Component({
  selector: 'app-toggle',
  imports: [FormsModule, Heading, Toggle],
  template: `
    <h4 meeHeader class="mb-5" id="togglePage">Toggle</h4>
    <button meeToggle [(ngModel)]="toggle">B</button>
  `,
})
export class ToggleComponent {
  toggle = '';
}
