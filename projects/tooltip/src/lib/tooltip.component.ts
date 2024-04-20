import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'mee-tooltip',
  standalone: true,
  imports: [],
  template: `{{ content }}`,
  styles: ``,
  host: {
    class:
      'fixed inline-block rounded bg-primary px-2 py-0.5 text-white text-sm',
    '[style.top.px]': 'top()',
    '[style.left.px]': 'left()',
    '[@slideInOutAnimation]': '1',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOutAnimation', [
      state('1', style({ transform: 'none', opacity: 1 })),
      state('void', style({ transform: 'translateY(20%)', opacity: 0 })),
      state('0', style({ transform: 'translateY(20%)', opacity: 0 })),
      transition('* => *', animate('200ms ease-out')),
    ]),
  ],
})
export class TooltipComponent {
  content = 'Tooltip';
  target!: HTMLElement;
  top = signal(0);
  left = signal(0);
  el = inject(ElementRef);

  constructor() {
    afterNextRender(() => {
      const { top, left, width, height } = this.target.getBoundingClientRect();
      const { width: elWidth, height: elHeight } =
        this.el.nativeElement.getBoundingClientRect();
      let tTop = top - elHeight - 5;
      const tLeft = left + width / 2 - elWidth / 2;
      // we need to check whether the tooltip is overflowing the viewport on top
      // if so, we need to adjust the top position
      if (tTop < 0) {
        tTop = top + height + 5;
      }
      this.top.set(tTop);
      this.left.set(tLeft);
    });
  }
}
