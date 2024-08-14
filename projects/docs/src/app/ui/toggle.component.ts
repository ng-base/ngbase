import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { Toggle } from '@meeui/toggle';

@Component({
  standalone: true,
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
