import { Directive, ElementRef, OnDestroy, effect, inject, input } from '@angular/core';
import { tooltipPortal } from './tooltip.service';
import { DialogPosition } from '../portal';

@Directive({
  standalone: true,
  selector: '[meeTooltip]',
  // host: {
  //   '(mouseenter)': 'show()',
  //   '(mouseleave)': 'hide()',
  // },
})
export class Tooltip implements OnDestroy {
  meeTooltip = input<string>();
  meeTooltipPosition = input<DialogPosition>('top');
  delay = input(0);
  el = inject(ElementRef);
  tooltip = tooltipPortal();
  destroy!: VoidFunction;
  timer: any;

  constructor() {
    let active = false;
    effect(() => {
      if (this.meeTooltip()) {
        if (!active) {
          this.el.nativeElement.addEventListener('mouseenter', this.show);
          this.el.nativeElement.addEventListener('mouseleave', this.hide);
          active = true;
        }
      } else if (active) {
        this.remove();
        active = false;
      }
    });
  }

  show = () => {
    if (this.delay() === 0) {
      this.insert();
      return;
    }
    this.timer = setTimeout(() => {
      this.insert();
    }, 300);
  };

  private insert() {
    const { destroy } = this.tooltip.open(
      this.meeTooltip()!,
      this.el.nativeElement,
      this.meeTooltipPosition(),
    );
    this.destroy = destroy;
  }

  hide = () => {
    clearTimeout(this.timer);
    this.destroy?.();
  };

  remove() {
    this.el.nativeElement.removeEventListener('mouseenter', this.show);
    this.el.nativeElement.removeEventListener('mouseleave', this.hide);
  }

  ngOnDestroy() {
    this.remove();
  }
}
