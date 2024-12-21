import { Component } from '@angular/core';
import { Card } from '@meeui/ui/card';
import { List } from '@meeui/ui/list';
import { ContextMenu, Menu } from '@meeui/ui/menu';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-context-menu',
  imports: [ContextMenu, Heading, Menu, List, Card, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="contextMenuPage">Context Menu</h4>
    <app-doc-code [tsCode]="tsCode">
      <mee-card class="grid h-72 w-96 place-items-center" [meeContextMenu]="menuContainer1">
        <mee-card class="grid h-32 w-52 place-items-center" [meeContextMenu]="menuContainer">
          Right click to open context menu
        </mee-card>
      </mee-card>
    </app-doc-code>

    <mee-menu #menuContainer>
      <button meeList class="w-28">Cut</button>
      <button meeList class="w-28">Copy</button>
      <button meeList class="w-28">Paste</button>
    </mee-menu>

    <mee-menu #menuContainer1>
      <button meeList class="w-28">Save</button>
      <button meeList class="w-28">Exit</button>
    </mee-menu>
  `,
})
export default class ContextMenuComponent {
  tsCode = `
  import { Component } from '@angular/core';
  import { ContextMenu } from '@meeui/ui/menu';
  import { Menu } from '@meeui/ui/menu';
  import { Separator } from '@meeui/ui/separator';
  import { List } from '@meeui/ui/list';

  @Component({
    selector: 'app-root',
    imports: [
      ContextMenu, Menu,
      // Optional
      List, Separator
    ],
    template: \`
      <div [meeContextMenu]="menuContainer" class="h-44 w-96">
        Right click to open context menu
      </div>

      <mee-menu #menuContainer>
        <button meeList>Profile</button>
        <button meeList>Billing</button>
        <button meeList>Settings</button>
        <button meeList>Keyboard shortcuts</button>
        <mee-separator />
        <button meeList>Team</button>
        <button meeList>New Team</button>
      </mee-menu>
    \`,
  })
  export class AppComponent { }
  `;
}
