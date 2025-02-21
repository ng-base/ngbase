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
import { fadeAnimation } from '@ngbase/adk/utils';
import { SidenavType } from './sidenav.service';
import { SidenavService } from './sidenav.service';

@Component({
  selector: '[ngbSidenavOverlay]',
  template: ``,
  host: {
    class: 'sidenav-overlay',
    style: 'position:absolute;left:0;top:0;width:100%;height:100%;',
    '(click)': 'sidenav.toggle()',
    '[@fadeAnimation]': '',
  },
  animations: [fadeAnimation('500ms')],
})
export class NgbSidenavOverlay {
  readonly sidenav = inject(NgbSidenav);
}

@Directive({
  selector: '[ngbSidenav]',
  exportAs: 'ngbSidenav',
  providers: [SidenavService],
  host: {
    style: 'position:relative;width:100%;height:100%;',
  },
})
export class NgbSidenav {
  readonly sidenavService = inject(SidenavService);

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

export const provideSidenav = (sidenav: Type<NgbSidenav>) => [
  SidenavService,
  { provide: NgbSidenav, useExisting: sidenav },
];
