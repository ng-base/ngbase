import {
  Directive,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { TooltipService, tooltipPortal } from './tooltip.service';
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
  tooltip = inject(TooltipService);
  timer: any;

  constructor() {
    let active = false;
    effect(() => {
      const content = this.meeTooltip();
      untracked(() => {
        if (content) {
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
    });
  }

  show = () => {
    if (this.delay() === 0) {
      this.tooltip.insert(
        this.el.nativeElement,
        this.meeTooltip()!,
        this.meeTooltipPosition(),
      );
      return;
    }
    this.timer = setTimeout(() => {
      this.tooltip.insert(
        this.el.nativeElement,
        this.meeTooltip()!,
        this.meeTooltipPosition(),
      );
    }, 300);
  };

  hide = () => {
    clearTimeout(this.timer);
    this.tooltip.destroy?.();
  };

  remove() {
    this.hide();
    this.el.nativeElement.removeEventListener('mouseenter', this.show);
    this.el.nativeElement.removeEventListener('mouseleave', this.hide);
  }

  ngOnDestroy() {
    this.remove();
  }
}
