import { Component, OnInit } from '@angular/core';
import { ContextMenu, Menu } from '@meeui/menu';
import { Heading } from '@meeui/typography';
import { Separator } from '@meeui/separator';
import { List } from '@meeui/list';
import { Card } from '@meeui/card';

@Component({
  standalone: true,
  selector: 'app-context-menu',
  imports: [ContextMenu, Heading, Menu, List, Separator, Card],
  template: `
    <h4 meeHeader class="mb-5" id="contextMenuPage">Context Menu</h4>
    <mee-card class="grid h-44 place-items-center" [meeContextMenu]="menuContainer">
      Right click to open context menu
    </mee-card>

    <mee-menu #menuContainer>
      <button meeList>Profile</button>
      <button meeList>Billing</button>
      <button meeList>Settings</button>
      <button meeList>Keyboard shortcuts</button>
      <mee-separator></mee-separator>
      <button meeList>Team</button>
      <button meeList>New Team</button>
    </mee-menu>
  `,
})
export class ContextMenuComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
