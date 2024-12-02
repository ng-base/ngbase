import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  Signal,
} from '@angular/core';
import { Directionality } from '@meeui/adk/bidi';
import { SidenavService } from './sidenav.service';

@Directive({
  selector: '[meeSidenavHeaderContent]',
  host: {
    '[@slide]': "{ value: sidenavService.show(), params: { x: dir.isRtl() ? '100%' : '-100%' } }",
    '(@slide.done)': 'sidenavService.animationDone()',
    '(@slide.start)': 'sidenavService.animationStart()',
    '[style.width]': 'sidenavService.width()',
  },
})
export class MeeSidenavHeaderContent {
  readonly dir = inject(Directionality);
  readonly sidenavService = inject(SidenavService);
}

@Component({
  selector: '[meeSidenavHeader]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MeeSidenavHeaderContent],
  template: `
    <div meeSidenavHeaderContent class="h-full overflow-auto">
      <ng-content />
    </div>
  `,
  host: {
    style: 'overflow:hidden',
    '[style.visibility]': 'sidenavService.visibility() ? "visible" : "hidden"',
    '[class]': `headerClasses()`,
    '[style.width]': `sidenavService.show() ? width() : 0`,
    '[style.transition]': "'500ms cubic-bezier(0.55, 0.31, 0.15, 0.93) width'",
    '[attr.aria-hidden]': '!sidenavService.show()',
    '[attr.data-mode]': 'sidenavService.mode()',
  },
  animations: [
    trigger('slide', [
      state('true', style({ transform: 'translateX(0)' })),
      state('false', style({ transform: 'translateX({{x}})' }), { params: { x: '-100%' } }),
      transition('* => *', animate('500ms cubic-bezier(0.55, 0.31, 0.15, 0.93)')),
    ]),
  ],
})
export class MeeSidenavHeader {
  readonly sidenavService = inject(SidenavService);
  readonly el = inject(ElementRef);
  readonly dir = inject(Directionality);

  readonly width = input('250px');

  readonly headerClasses = computed(() => {
    let clazz = '';
    if (this.sidenavService.mode() === 'over') {
      clazz += 'absolute top-0 z-p h-full shadow-2xl';
    }
    if (this.dir.isRtl()) {
      clazz += `right-0 border-l`;
    } else {
      clazz += `left-0 border-r`;
    }
    return clazz;
  });

  constructor() {
    this.sidenavService.width = this.width as Signal<string>;
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
