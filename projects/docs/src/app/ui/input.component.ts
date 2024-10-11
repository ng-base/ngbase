import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { Input, Label } from '@meeui/input';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-input',
  imports: [FormsModule, Heading, Input, Label, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="inputPage">Input</h4>
    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
      <div class="flex flex-col gap-b4">
        <label meeLabel>
          Input
          <input meeInput [(ngModel)]="inputValue" placeholder="Input" id="input" class="w-full" />
        </label>

        <label meeLabel>
          Textarea
          <textarea type="text" meeInput id="textarea" class="w-full"></textarea>
        </label>
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
