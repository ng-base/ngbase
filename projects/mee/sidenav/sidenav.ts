import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NgbSidenav,
  NgbSidenavHeader,
  NgbSidenavHeaderContent,
  NgbSidenavHeaderTrack,
  NgbSidenavOverlay,
  provideSidenav,
  slideAnimation,
  SidenavType,
} from '@ngbase/adk/sidenav';

export type { SidenavType };

@Component({
  selector: 'mee-sidenav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideSidenav(Sidenav)],
  imports: [NgbSidenavOverlay, NgbSidenavHeaderTrack],
  template: `
    @if (showOverlay()) {
      <div ngbSidenavOverlay class="z-p bg-black/70"></div>
    }
    <div ngbSidenavHeaderTrack class="transition-[width] duration-500"></div>
    <ng-content select="mee-sidenav-header" />
    <ng-content />
  `,
  host: {
    class: 'flex w-full overflow-hidden relative top-0 left-0 h-full',
  },
})
export class Sidenav extends NgbSidenav {}

@Component({
  selector: 'mee-sidenav-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbSidenavHeaderContent],
  template: `
    <div ngbSidenavHeaderContent class="h-full overflow-auto">
      <ng-content />
    </div>
  `,
  host: {
    class: 'block h-full bg-foreground z-p transition-[width] duration-500',
  },
  animations: [slideAnimation('500ms cubic-bezier(0.4, 0, 0.2, 1)')],
})
export class SidenavHeader extends NgbSidenavHeader {}
