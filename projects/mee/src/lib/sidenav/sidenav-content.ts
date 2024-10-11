import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Sidenav } from './sidenav';

@Component({
  standalone: true,
  selector: 'mee-sidenav-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'block h-full flex-1',
    // '[style.marginLeft.px]': 'sidenav.left()',
    '[class.transition-all]': 'sidenav.headerWidth()',
  },
})
export class SidenavContent {
  sidenav = inject(Sidenav);
}
