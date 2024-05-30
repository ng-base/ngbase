import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { Input } from '@meeui/input';

@Component({
  standalone: true,
  selector: 'app-input',
  imports: [FormsModule, Heading, Input],
  template: `
    <h4 meeHeader class="mb-5" id="inputPage">Input</h4>
    <input
      meeInput
      [(ngModel)]="inputValue"
      placeholder="Input"
      class="w-full"
    />

    <p>Textarea</p>
    <textarea type="text" meeInput class="w-full"></textarea>
  `,
})
export class InputComponent {
  inputValue = '';
}
