import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeSidenavHeader, MeeSidenavHeaderContent } from '@meeui/adk/sidenav';

@Component({
  selector: 'mee-sidenav-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MeeSidenavHeaderContent],
  host: {
    class: 'block h-full bg-foreground',
  },
  template: `
    <div meeSidenavHeaderContent class="h-full overflow-auto">
      <ng-content />
    </div>
  `,
})
export class SidenavHeader extends MeeSidenavHeader {}
