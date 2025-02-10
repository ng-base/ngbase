import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  MeeSidenav,
  MeeSidenavHeader,
  MeeSidenavHeaderContent,
  MeeSidenavHeaderTrack,
  MeeSidenavOverlay,
  provideSidenav,
  slideAnimation,
  SidenavType,
} from '@meeui/adk/sidenav';

export type { SidenavType };

@Component({
  selector: 'mee-sidenav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideSidenav(Sidenav)],
  imports: [MeeSidenavOverlay, MeeSidenavHeaderTrack],
  template: `
    @if (showOverlay()) {
      <div meeSidenavOverlay class="z-p bg-black/70"></div>
    }
    <div meeSidenavHeaderTrack class="transition-[width] duration-500"></div>
    <ng-content select="mee-sidenav-header" />
    <ng-content />
  `,
  host: {
    class: 'flex w-full overflow-hidden relative top-0 left-0 h-full',
  },
})
export class Sidenav extends MeeSidenav {}

@Component({
  selector: 'mee-sidenav-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MeeSidenavHeaderContent],
  template: `
    <div meeSidenavHeaderContent class="h-full overflow-auto">
      <ng-content />
    </div>
  `,
  host: {
    class: 'block h-full bg-foreground z-p transition-[width] duration-500',
  },
  animations: [slideAnimation('500ms cubic-bezier(0.4, 0, 0.2, 1)')],
})
export class SidenavHeader extends MeeSidenavHeader {}
