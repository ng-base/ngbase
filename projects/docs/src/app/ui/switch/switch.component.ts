import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Switch } from '@meeui/ui/switch';
import { Heading } from '@meeui/ui/typography';
import { DocCode, getCode } from '../code.component';

@Component({
  selector: 'app-switch',
  imports: [FormsModule, Heading, Switch, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="switchPage">Switch</h4>
    <app-doc-code [tsCode]="tsCode()" [adkCode]="adkCode()">
      <mee-switch class="w-full" [(ngModel)]="switch">Switch the UI</mee-switch>
    </app-doc-code>
  `,
})
export default class SwitchComponent {
  switch = false;

  tsCode = getCode('switch/switch-usage.ts');

  adkCode = getCode('switch/switch-adk.ts');
}
