import { Component, OnInit } from '@angular/core';
import { ContextMenu, Menu } from '@meeui/menu';
import { Heading } from '@meeui/typography';
import { Separator } from '@meeui/separator';
import { List } from '@meeui/list';
import { Card } from '@meeui/card';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-context-menu',
  imports: [ContextMenu, Heading, Menu, List, Separator, Card, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="contextMenuPage">Context Menu</h4>
    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
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
export class ContextMenuComponent {
  htmlCode = `
      <div [meeContextMenu]="menuContainer" class="h-44 w-96">
        Right click to open context menu
      </div>

      <mee-menu #menuContainer>
        <button meeList>Profile</button>
        <button meeList>Billing</button>
        <button meeList>Settings</button>
        <button meeList>Keyboard shortcuts</button>
        <mee-separator></mee-separator>
        <button meeList>Team</button>
        <button meeList>New Team</button>
      </mee-menu>
    `;

  tsCode = `
  import { Component } from '@angular/core';
  import { ContextMenu } from '@meeui/menu';
  import { Menu } from '@meeui/menu';
  import { Separator } from '@meeui/separator';
  import { List } from '@meeui/list';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [
      ContextMenu, Menu,
      // Optional
      List, Separator
    ],
    template: \`${this.htmlCode}\`,
  })
  export class AppComponent { }
  `;
}
