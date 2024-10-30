import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InlineEdit } from '@meeui/inline-edit';
import { Heading } from '@meeui/typography';

@Component({
  standalone: true,
  imports: [FormsModule, Heading, InlineEdit],
  selector: 'app-inline-edit',
  template: `
    <h4 meeHeader>Inline Edit</h4>
    {{ value() }}
    <mee-inline-edit [(ngModel)]="value" />
  `,
})
export class InlineEditComponent {
  value = signal('Hello World');
}
