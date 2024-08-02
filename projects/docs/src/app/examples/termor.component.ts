import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from '@meeui/card';
import { Sidenav, SidenavContent, SidenavHeader } from '@meeui/sidenav';

@Component({
  standalone: true,
  selector: 'app-termor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Sidenav, SidenavHeader, SidenavContent],
  template: `
    <mee-card class="h-[950px] overflow-hidden !p-0">
      <mee-sidenav>
        <mee-sidenav-header class="w-64 border-r bg-foreground">
          <div class="flex h-full w-64 flex-col"></div>
        </mee-sidenav-header>
        <mee-sidenav-content class="flex-1"> </mee-sidenav-content>
      </mee-sidenav>
    </mee-card>
  `,
})
export class TermorComponent {}
