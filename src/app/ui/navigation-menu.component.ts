import { Component } from '@angular/core';
import { Button } from '@meeui/button';
import { Menu, MenuTrigger, NavigationMenu } from '@meeui/menu';
import { List } from '@meeui/list';
import { RangePipe } from '@meeui/utils';

@Component({
  standalone: true,
  selector: 'app-navigation-menu',
  imports: [Button, Menu, List, NavigationMenu, MenuTrigger, RangePipe],
  template: `
    <nav class="flex gap-2" meeNavigationMenu>
      <button meeButton variant="ghost">Home</button>
      <button meeButton variant="ghost">About</button>
      <button meeButton variant="ghost" [meeMenuTrigger]="solutionMenu">
        Solutions
        <div class="ml-2 flex items-center">&#8964;</div>
      </button>
      <button meeButton variant="ghost" [meeMenuTrigger]="productMenu">
        Products
        <div class="ml-2 flex items-center">&#8964;</div>
      </button>
    </nav>

    <mee-menu #solutionMenu>
      <div class="min-w-[180px] p-2">
        <button meeList>Careers</button>
        <button meeList>Changelog</button>
        <button meeList>Enterprise</button>
        <button meeList>Philosophy</button>
        <button meeList>Security</button>
      </div>
    </mee-menu>

    <mee-menu #productMenu>
      <div class="flex gap-2 p-2">
        <div>
          <button meeList>Getting Started</button>
          <button meeList>API Reference</button>
          <button meeList>Integrations</button>
          <button meeList>Examples</button>
          <button meeList>SDKs</button>
        </div>
        <div class="grid grid-cols-4">
          @for (item of 16 | range; track $index) {
            <button meeButton variant="ghost">-></button>
          }
        </div>
      </div>
    </mee-menu>
  `,
})
export class NavigationMenuComponent {}
