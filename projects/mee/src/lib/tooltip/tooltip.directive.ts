import { Directive, ElementRef, inject, input } from '@angular/core';
import { tooltipPortal } from './tooltip.service';
import { DialogPosition } from '../portal';

@Directive({
  standalone: true,
  selector: '[meeTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
  },
})
export class Tooltip {
  meeTooltip = input.required<string>();
  meeTooltipPosition = input<DialogPosition>('top');
  delay = input(0);
  el = inject(ElementRef);
  tooltip = tooltipPortal();
  destroy!: () => void;
  timer: any;

  constructor() {}

  show() {
    if (this.delay() === 0) {
      this.insert();
      return;
    }
    this.timer = setTimeout(() => {
      this.insert();
    }, 300);
  }

  private insert() {
    const { destroy } = this.tooltip.open(
      this.meeTooltip(),
      this.el.nativeElement,
      this.meeTooltipPosition(),
    );
    this.destroy = destroy;
  }

  hide() {
    clearTimeout(this.timer);
    this.destroy?.();
  }
}
