import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { ToggleGroup, ToggleItem } from '@meeui/toggle-group';

@Component({
  standalone: true,
  selector: 'app-toggle-group',
  imports: [FormsModule, Heading, ToggleGroup, ToggleItem],
  template: `
    <h4 meeHeader class="mb-5" id="toggleGroupPage">Toggle Group</h4>
    <mee-toggle-group [(ngModel)]="toggleGroup">
      <button meeToggleItem value="A">A</button>
      <button meeToggleItem value="B">B</button>
      <button meeToggleItem value="C">C</button>
    </mee-toggle-group>
  `,
})
export class ToggleGroupComponent {
  toggleGroup = ['A'];
}
