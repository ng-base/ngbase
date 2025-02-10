import {
  Component,
  computed,
  Directive,
  inject,
  input,
  linkedSignal,
  model,
  signal,
  Type,
} from '@angular/core';
import { fadeAnimation } from '@meeui/adk/utils';
import { SidenavType } from './sidenav.service';
import { SidenavService } from './sidenav.service';

@Component({
  selector: '[meeSidenavOverlay]',
  template: ``,
  host: {
    class: 'sidenav-overlay',
    style: 'position:absolute;left:0;top:0;width:100%;height:100%;',
    '(click)': 'sidenav.toggle()',
    '[@fadeAnimation]': '',
  },
  animations: [fadeAnimation('500ms')],
})
export class MeeSidenavOverlay {
  readonly sidenav = inject(MeeSidenav);
}

@Directive({
  selector: '[meeSidenav]',
  exportAs: 'meeSidenav',
  providers: [SidenavService],
  host: {
    style: 'position:relative;width:100%;height:100%;',
  },
})
export class MeeSidenav {
  readonly sidenavService = inject(SidenavService);
  readonly status = signal(1);

  // Inputs
  readonly show = model(true);
  readonly mode = input<SidenavType>('side');

  readonly showOverlay = computed(() => this.mode() === 'over' && this.show());

  constructor() {
    this.sidenavService.show = linkedSignal(this.show);
    this.sidenavService.mode = linkedSignal(this.mode);
  }

  toggle() {
    this.show.update(show => !show);
  }
}

export const provideSidenav = (sidenav: Type<MeeSidenav>) => [
  SidenavService,
  { provide: MeeSidenav, useExisting: sidenav },
];
