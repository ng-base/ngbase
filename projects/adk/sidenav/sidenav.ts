import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  inject,
  input,
  model,
  Type,
} from '@angular/core';
import { fadeAnimation } from '@meeui/adk/utils';
import { ModeType, SidenavService } from './sidenav.service';

@Directive({
  selector: '[meeSidenavOverlay]',
  host: {
    class: 'sidenav-overlay',
    style: 'position:absolute;left:0;top:0;width:100%;height:100%;',
    '(click)': 'sidenav.toggle()',
    '[@fadeAnimation]': '',
  },
})
export class MeeSidenavOverlay {
  readonly sidenav = inject(MeeSidenav);
}

@Component({
  selector: '[meeSidenav]',
  exportAs: 'meeSidenav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SidenavService],
  imports: [MeeSidenavOverlay],
  template: `
    @if (mode() === 'over' && show()) {
      <div meeSidenavOverlay [@fadeAnimation] class="bg-black/70"></div>
    }
    <ng-content select="mee-sidenav-header" />
    <ng-content />
  `,
  host: {
    class: 'flex w-full overflow-hidden relative top-0 left-0 h-full',
  },
  animations: [fadeAnimation('500ms')],
})
export class MeeSidenav {
  readonly sidenavService = inject(SidenavService);

  // Inputs
  readonly show = model(true);
  readonly mode = input<ModeType>('side');

  constructor() {
    this.sidenavService.show = this.show;
    this.sidenavService.mode = this.mode;
  }

  toggle() {
    this.show.update(show => !show);
  }
}

export const provideSidenav = (sidenav: Type<MeeSidenav>) => [
  SidenavService,
  { provide: MeeSidenav, useExisting: sidenav },
];
