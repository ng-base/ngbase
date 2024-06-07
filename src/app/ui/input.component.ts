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
    <div class="gap-b4 flex flex-col">
      <div>
        <label for="input" class="mb-b block">Input</label>
        <input
          meeInput
          [(ngModel)]="inputValue"
          placeholder="Input"
          id="input"
          class="w-full"
        />
      </div>

      <div>
        <label class="mb-b block" for="textarea">Textarea</label>
        <textarea type="text" meeInput id="textarea" class="w-full"></textarea>
      </div>
    </div>
  `,
})
export class InputComponent {
  inputValue = '';
}
