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
import { TooltipService } from './tooltip.service';
import { PopoverPosition } from '../popover';

export function provideTooltipOptions(options: TooltipOptions) {
  return { provide: TOOLTIP_OPTIONS, useValue: options };
}

export const TOOLTIP_OPTIONS = new InjectionToken<TooltipOptions>('TOOLTIP_OPTIONS');

export interface TooltipOptions {
  showDelay?: number;
  hideDelay?: number;
  position?: PopoverPosition;
}

@Directive({
  standalone: true,
  selector: '[meeTooltip]',
})
export class Tooltip implements OnDestroy {
  // Dependencies
  private defaultOptions = inject(TOOLTIP_OPTIONS, { optional: true });
  private el = inject(ElementRef);
  private tooltipService = inject(TooltipService);

  // Inputs
  readonly meeTooltip = input<string>();
  readonly meeTooltipPosition = input<PopoverPosition>();
  readonly delay = input(0);

  // State
  readonly options = computed(() => {
    const o = this.defaultOptions || {};
    const options: TooltipOptions = {
      showDelay: this.delay() || o.showDelay || 0,
      hideDelay: o.hideDelay || 0,
      position: this.meeTooltipPosition() || o.position || 'top',
    };
    return options;
  });
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
