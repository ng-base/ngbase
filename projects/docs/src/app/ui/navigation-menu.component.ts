import { Component } from '@angular/core';
import { RangePipe } from '@ngbase/adk/utils';
import { Button } from '@meeui/ui/button';
import { List } from '@meeui/ui/list';
import { Menu, MenuTrigger, NavigationMenu } from '@meeui/ui/menu';
import { DocCode } from './code.component';

@Component({
  selector: 'app-navigation-menu',
  imports: [Button, Menu, List, NavigationMenu, MenuTrigger, RangePipe, DocCode],
  template: `
    <app-doc-code [tsCode]="tsCode">
      <nav class="flex gap-2 rounded-base border bg-foreground shadow-sm" meeNavigationMenu>
        <button meeButton="ghost">Home</button>
        <button meeButton="ghost">About</button>
        <button meeButton="ghost" [meeMenuTrigger]="solutionMenu">
          Solutions
          <div class="ml-2 flex items-center">&#8964;</div>
        </button>
        <button meeButton="ghost" [meeMenuTrigger]="productMenu">
          Products
          <div class="ml-2 flex items-center">&#8964;</div>
        </button>
      </nav>
    </app-doc-code>

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
            <button meeButton="ghost">-></button>
          }
        </div>
      </div>
    </mee-menu>
  `,
})
export default class NavigationMenuComponent {
  tsCode = `
  import { Component } from '@angular/core';
  import { Button } from '@meeui/ui/button';
  import { Menu, MenuTrigger, NavigationMenu } from '@meeui/ui/menu';
  import { List } from '@meeui/ui/list';

  @Component({
    selector: 'app-root',
    imports: [
      NavigationMenu, MenuTrigger, Menu,
      // Optional
      Button, Menu, List
    ],
    template: \`
      <nav meeNavigationMenu>
        <button meeButton="ghost">Home</button>
        <button meeButton="ghost">About</button>
        <button meeButton="ghost" [meeMenuTrigger]="solutionMenu">
          Solutions
          <div class="ml-2 flex items-center">&#8964;</div>
        </button>
        <button meeButton="ghost" [meeMenuTrigger]="productMenu">
          Products
          <div class="ml-2 flex items-center">&#8964;</div>
        </button>
      </nav>

      <mee-menu #solutionMenu>
        <button meeList>Careers</button>
        <button meeList>Changelog</button>
        <button meeList>Enterprise</button>
        <button meeList>Philosophy</button>
        <button meeList>Security</button>
      </mee-menu>

      <mee-menu #productMenu>
        <button meeList>Getting Started</button>
        <button meeList>API Reference</button>
        <button meeList>Integrations</button>
        <button meeList>Examples</button>
        <button meeList>SDKs</button>
      </mee-menu>
    \`
  })
  export class AppComponent { }
  `;
}
