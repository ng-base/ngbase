import {
  Directive,
  ElementRef,
  InjectionToken,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { TooltipService, tooltipPortal } from './tooltip.service';
import { DialogPosition } from '../portal';

export const TOOLTIP_DEFAULT_OPTIONS = new InjectionToken<TooltipDefaultOptions>(
  'TOOLTIP_DEFAULT_OPTIONS',
);

export interface TooltipDefaultOptions {
  showDelay?: number;
  hideDelay?: number;
  position?: DialogPosition;
}

@Directive({
  standalone: true,
  selector: '[meeTooltip]',
  // host: {
  //   '(mouseenter)': 'show()',
  //   '(mouseleave)': 'hide()',
  // },
})
export class Tooltip implements OnDestroy {
  private defaultOptions = inject(TOOLTIP_DEFAULT_OPTIONS, { optional: true });
  el = inject(ElementRef);
  tooltipService = inject(TooltipService);
  meeTooltip = input<string>();
  meeTooltipPosition = input<DialogPosition>();
  delay = input(0);
  options = computed(() => {
    const o = this.defaultOptions || {};
    const options: TooltipDefaultOptions = {
      showDelay: this.delay() || o.showDelay || 0,
      hideDelay: o.hideDelay || 0,
      position: this.meeTooltipPosition() || o.position || 'top',
    };
    return options;
  });
  timer: any;

  constructor() {
    let active = false;
    effect(
      () => {
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
      },
      { allowSignalWrites: true },
    );
  }

  show = () => {
    // listen when cursor is over and element is removed
    const options = this.options();
    if (options.showDelay === 0 || this.tooltipService.tooltipOpen) {
      this.tooltipService.insert(
        this.el.nativeElement,
        this.meeTooltip()!,
        options.position!,
        this.quickHide,
      );
      return;
    }
    this.timer = setTimeout(() => {
      this.tooltipService.insert(
        this.el.nativeElement,
        this.meeTooltip()!,
        options.position!,
        this.hide,
      );
    }, options.showDelay);
  };

  removed = () => {
    this.tooltipService.delay = 0;
    this.hide();
  };

  hide = () => {
    clearTimeout(this.timer);
    this.tooltipService.destroy();
  };

  quickHide = () => {
    this.tooltipService.delay = 0;
    this.hide();
  };

  private remove() {
    this.hide();
    this.el.nativeElement.removeEventListener('mouseenter', this.show);
    this.el.nativeElement.removeEventListener('mouseleave', this.hide);
  }

  ngOnDestroy() {
    this.remove();
  }
}
