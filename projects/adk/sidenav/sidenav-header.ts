import { animate, state, style, transition, trigger } from '@angular/animations';
import { computed, Directive, ElementRef, inject, input, linkedSignal } from '@angular/core';
import { Directionality } from '@ngbase/adk/bidi';
import { SidenavService } from './sidenav.service';

@Directive({
  selector: '[ngbSidenavHeaderContent]',
  host: {
    '[style.width]': 'w()',
  },
})
export class NgbSidenavHeaderContent {
  readonly sidenav = inject(SidenavService);
  readonly w = computed(() =>
    this.sidenav.mode() === 'partial' && !this.sidenav.show()
      ? this.sidenav.minWidth()
      : this.sidenav.width(),
  );
}

@Directive({
  selector: '[ngbSidenavHeaderTrack]',
  host: {
    '[style.width]': 'sidenav.w()',
  },
})
export class NgbSidenavHeaderTrack {
  readonly sidenav = inject(SidenavService);
}

export function slideAnimation(ease: string) {
  return trigger('slide', [
    state('true', style({ transform: 'translateX(0)' })),
    state('false', style({ transform: 'translateX({{x}})' }), { params: { x: '-100%' } }),
    transition('* <=> *', [animate(ease)]),
  ]);
}

@Directive({
  selector: '[ngbSidenavHeader]',
  host: {
    style: 'overflow:hidden;position:absolute;',
    '[style.visibility]': 'sidenav.visibility() ? "visible" : "hidden"',
    '[style]': `headerStyles()`,
    '[style.width]': `actualWidth()`,
    '[attr.aria-hidden]': '!sidenav.show()',
    '[attr.data-mode]': 'sidenav.mode()',
    '[@slide]': `{ value: sidenav.animate(), params: { x: dir.isRtl() ? w() : '-'+w() } }`,
    '(@slide.done)': 'sidenav.animationDone()',
    '(@slide.start)': 'sidenav.animationStart()',
    '[@.disabled]': 'isAnimationDisabled()',
  },
})
export class NgbSidenavHeader {
  readonly sidenav = inject(SidenavService);
  readonly el = inject(ElementRef);
  readonly dir = inject(Directionality);

  readonly width = input('250px');
  readonly minWidth = input('0');

  private initial = 0;
  readonly isAnimationDisabled = linkedSignal({
    source: this.sidenav.animate,
    computation: () => this.initial++ === 0, // this will not considered on initial render due to increment
  });

  readonly w = computed(() => (this.sidenav.mode() === 'partial' ? this.minWidth() : this.width()));
  readonly actualWidth = computed(() => {
    if (this.sidenav.show()) {
      return this.width();
    } else if (this.sidenav.mode() === 'partial') {
      return this.minWidth();
    } else if (this.sidenav.mode() === 'over') {
      return this.width();
    }
    return this.width();
  });

  readonly headerStyles = computed(() => {
    let styles = {};
    if (this.sidenav.mode() === 'over') {
      styles = { ...styles, position: 'absolute', top: '0', height: '100%' };
    }
    if (this.dir.isRtl()) {
      styles = { ...styles, right: '0' };
    } else {
      styles = { ...styles, left: '0' };
    }
    return styles;
  });

  constructor() {
    this.sidenav.width = linkedSignal(this.width);
    this.sidenav.minWidth = linkedSignal(this.minWidth);
  }
}
