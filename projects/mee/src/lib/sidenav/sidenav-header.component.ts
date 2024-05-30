import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Sidenav } from './sidenav.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  standalone: true,
  selector: 'mee-sidenav-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [@slide]="sidenav.show()">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    class: 'block h-full overflow-hidden transition-all',
    // '[@slide]': 'sidenav.show()',
    '[style.width.px]': `sidenav.show() ? '' : 0`,
  },
  animations: [
    trigger('slide', [
      state('true', style({ transform: 'translateX(0)' })),
      state('false', style({ transform: 'translateX(-100%)' })),
      transition('* => *', animate('150ms ease')),
    ]),
  ],
})
export class SidenavHeader {
  sidenav = inject(Sidenav);
}
