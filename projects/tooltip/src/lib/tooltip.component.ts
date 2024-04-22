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
import { DialogPosition, tooltipPosition } from '@meeui/portal';

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
  position: DialogPosition = 'top';

  constructor() {
    afterNextRender(() => {
      const el = this.el.nativeElement;
      const { top, left } = tooltipPosition(this.target, el, this.position);
      this.top.set(top);
      this.left.set(left);
    });
  }
}
