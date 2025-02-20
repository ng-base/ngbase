import { Component, OnInit } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-buttons',
  imports: [Button, Heading, DocCode],
  template: `
    <h4 meeHeader="sm" class="mb-5" id="buttonsPage">Buttons</h4>

    <app-doc-code [tsCode]="tsCode" [adkCode]="adkCode">
      <button meeButton class="mr-2">Primary</button>
      <button meeButton="secondary" class="mr-2">Outline</button>
      <button meeButton="outline" class="mr-2">Outline</button>
      <button meeButton="ghost" class="mr-2">Outline</button>

      <h4 class="mt-5">Disabled Button</h4>
      <button meeButton disabled class="mr-2">Primary</button>
      <button meeButton="secondary" disabled class="mr-2">Outline</button>
      <button meeButton="outline" disabled class="mr-2">Outline</button>
      <button meeButton="ghost" disabled class="mr-2">Outline</button>

      <h4 class="mt-5">Small Button</h4>
      <button meeButton class="small mr-2">Primary</button>
      <button meeButton="secondary" class="small mr-2">Outline</button>
      <button meeButton="outline" class="small mr-2">Outline</button>
      <button meeButton="ghost" class="small mr-2">Outline</button>
    </app-doc-code>
  `,
})
export default class ButtonsComponent {
  tsCode = `
  import { Component } from '@angular/core';
  import { Button } from '@meeui/ui/button';

  @Component({
    selector: 'app-root',
    imports: [Button],
    template: \`
      <button meeButton>Primary</button>
      <button meeButton="secondary">Outline</button>
      <button meeButton="outline">Outline</button>
      <button meeButton="ghost">Outline</button>
    \`
  })
  export class AppComponent {}
  `;

  adkCode = `
  import { Button } from '@meeui/ui/button';
  import { Heading } from '@meeui/ui/typography';

  @Component({
    selector: 'app-buttons',
    imports: [Button, Heading],
    template: \`
    <button meeButton class="mr-2">Primary</button>
    <button meeButton="secondary" class="mr-2">Outline</button>
    <button meeButton="outline" class="mr-2">Outline</button>
    <button meeButton="ghost" class="mr-2">Outline</button>
    \`
  })
  export class ButtonsComponent {}
  `;
}
