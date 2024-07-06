import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { Sidenav } from './sidenav.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'mee-sidenav-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [@slide]="sidenav.show()" class="h-full w-64 overflow-auto">
      <ng-content />
    </div>
  `,
  host: {
    class: 'block h-full overflow-hidden',
    // '[@slide]': 'sidenav.show()',
    '[style.width.px]': `sidenav.show() ? '' : 0`,
    '[style.transition]': "'500ms cubic-bezier(0.55, 0.31, 0.15, 0.93) width'",
  },
  animations: [
    trigger('slide', [
      state('true', style({ transform: 'translateX(0)' })),
      state('false', style({ transform: 'translateX(-100%)' })),
      transition('* => *', animate('500ms cubic-bezier(0.55, 0.31, 0.15, 0.93)')),
    ]),
  ],
})
export class SidenavHeader {
  sidenav = inject(Sidenav);
  el = inject(ElementRef);
  lastWidth = 0;

  // width = computed(() => {
  //   const lastWidth = this.sidenav.show()
  //     ? this.el.nativeElement.clientWidth
  //     : this.lastWidth;
  //   this.lastWidth &&= lastWidth;
  //   return this.lastWidth;
  // });
}
