import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Switch } from '@meeui/ui/switch';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-switch',
  imports: [FormsModule, Heading, Switch, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="switchPage">Switch</h4>
    <app-doc-code [tsCode]="tsCode">
      <mee-switch class="w-full" [(ngModel)]="switch">Switch the UI</mee-switch>
    </app-doc-code>
  `,
})
export class SwitchComponent {
  switch = false;

  tsCode = `
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { Switch } from '@meeui/ui/switch';

  @Component({
    selector: 'app-switch',
    imports: [Switch, FormsModule],
    template: \`
      <mee-switch [(ngModel)]="switch">Switch the UI</mee-switch>
    \`
  })
  export class SwitchComponent {
    switch = false;
  }
  `;
}
