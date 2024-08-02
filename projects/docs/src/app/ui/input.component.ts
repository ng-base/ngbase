import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { Input } from '@meeui/input';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-input',
  imports: [FormsModule, Heading, Input, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="inputPage">Input</h4>
    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
      <div class="flex flex-col gap-b4">
        <div>
          <label for="input" class="mb-b block">Input</label>
          <input meeInput [(ngModel)]="inputValue" placeholder="Input" id="input" class="w-full" />
        </div>

        <div>
          <label class="mb-b block" for="textarea">Textarea</label>
          <textarea type="text" meeInput id="textarea" class="w-full"></textarea>
        </div>
      </div>
    </app-doc-code>
  `,
})
export class InputComponent {
  inputValue = '';

  htmlCode = `
      <input meeInput [(ngModel)]="inputValue" placeholder="Input" />
      
      <textarea meeInput></textarea>
    `;

  tsCode = `
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { Input } from '@meeui/input';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [FormsModule, Input],
    template: \`${this.htmlCode}\`,
  })
  export class AppComponent {
    inputValue = '';
  }
  `;
}
