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
    <app-doc-code [tsCode]="tsCode" [adkCode]="adkCode">
      <mee-switch class="w-full" [(ngModel)]="switch">Switch the UI</mee-switch>
    </app-doc-code>
  `,
})
export default class SwitchComponent {
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

  adkCode = `
  import { ChangeDetectionStrategy, Component } from '@angular/core';
  import { MeeSwitch, MeeSwitchLabel, MeeSwitchThumb, MeeSwitchTrack } from '@meeui/adk/switch';

  @Component({
    selector: 'mee-switch',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [
      { directive: MeeSwitch, inputs: ['checked', 'disabled'], outputs: ['checkedChange', 'change'] },
    ],
    imports: [MeeSwitchTrack, MeeSwitchLabel, MeeSwitchThumb],
    template: \`
      <button
        meeSwitchTrack
        class="relative h-b5 w-b9 rounded-full border-b0.5 border-transparent bg-muted-background transition-colors aria-[checked=true]:bg-primary"
      >
        <span
          #thumb="meeSwitchThumb"
          meeSwitchThumb
          [class]="thumb.checked() ? (thumb.rtl() ? '-translate-x-full' : 'translate-x-full') : ''"
          class="block h-b4 w-b4 rounded-full bg-foreground shadow-sm transition-transform"
        ></span>
      </button>
      <label meeSwitchLabel><ng-content /></label>
    \`,
    host: {
      class: 'inline-flex items-center gap-b2 py-b',
    },
  })
  export class Switch {}
  `;
}
