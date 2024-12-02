import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeSidenav, MeeSidenavOverlay, provideSidenav } from '@meeui/adk/sidenav';

export type ModeType = 'side' | 'over';

@Component({
  selector: 'mee-sidenav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideSidenav(Sidenav)],
  imports: [MeeSidenavOverlay],
  host: {
    class: 'flex w-full overflow-hidden relative top-0 left-0 h-full',
  },
  template: `
    @if (mode() === 'over' && show()) {
      <div meeSidenavOverlay class="z-p bg-black/70"></div>
    }
    <ng-content select="mee-sidenav-header" />
    <ng-content />
  `,
})
export class Sidenav extends MeeSidenav {}
