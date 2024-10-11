import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { Sidenav } from './sidenav.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Directionality } from '../utils';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'mee-sidenav-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  template: `
    <div
      [@slide]="{ value: sidenav.show(), params: { x: dir.isRtl() ? '100%' : '-100%' } }"
      (@slide.done)="animationDone()"
      (@slide.start)="animationStart()"
      class="h-full w-64 overflow-auto"
      [attr.data-mode]="sidenav.mode()"
    >
      <ng-content />
    </div>
  `,
  host: {
    class: 'block h-full overflow-hidden bg-foreground',
    '[class.invisible]': 'show()',
    '[class]': `headerClasses()`,
    // '[@slide]': 'sidenav.show()',
    '[style.width.px]': `sidenav.show() ? '' : 0`,
    '[style.transition]': "'500ms cubic-bezier(0.55, 0.31, 0.15, 0.93) width'",
    '[attr.aria-hidden]': '!sidenav.show()',
  },
  animations: [
    trigger('slide', [
      state('true', style({ transform: 'translateX(0)' })),
      state('false', style({ transform: 'translateX({{x}})' }), { params: { x: '-100%' } }),
      transition('* => *', animate('500ms cubic-bezier(0.55, 0.31, 0.15, 0.93)')),
    ]),
  ],
})
export class SidenavHeader {
  readonly sidenav = inject(Sidenav);
  readonly el = inject(ElementRef);
  readonly dir = inject(Directionality);
  readonly headerClasses = computed(() => {
    let klass = '';
    if (this.sidenav.mode() === 'over') {
      klass += 'absolute top-0 z-p h-full shadow-2xl';
    }
    if (this.dir.isRtl()) {
      klass += `right-0 border-l`;
    } else {
      klass += `left-0 border-r`;
    }
    return klass;
  });

  readonly show = signal(0);

  animationDone() {
    this.show.set(this.sidenav.show() ? 0 : 1);
  }

  animationStart() {
    this.show.set(0);
  }

  // lastWidth = 0;

  // width = computed(() => {
  //   const lastWidth = this.sidenav.show()
  //     ? this.el.nativeElement.clientWidth
  //     : this.lastWidth;
  //   this.lastWidth &&= lastWidth;
  //   return this.lastWidth;
  // });
}
