import {
  Directive,
  ElementRef,
  InjectionToken,
  OnDestroy,
  Type,
  afterRenderEffect,
  computed,
  inject,
  input,
  untracked,
} from '@angular/core';
import { PopoverPosition } from '@ngbase/adk/popover';
import { TooltipService } from './tooltip.service';
import { NgbTooltipTemplate } from './tooltip';

export function provideNgbTooltipOptions(options: TooltipOptions) {
  return { provide: TOOLTIP_OPTIONS, useValue: options };
}

export const TOOLTIP_OPTIONS = new InjectionToken<TooltipOptions>('TOOLTIP_OPTIONS');

export interface TooltipOptions {
  showDelay?: number;
  hideDelay?: number;
  position?: PopoverPosition;
  component?: Type<NgbTooltipTemplate>;
}

@Directive({
  selector: '[ngbTooltip]',
})
export class NgbTooltip implements OnDestroy {
  // Dependencies
  private defaultOptions = inject(TOOLTIP_OPTIONS, { optional: true });
  private el = inject(ElementRef);
  private tooltipService = inject(TooltipService);

  // Inputs
  readonly ngbTooltip = input<string>();
  readonly ngbTooltipPosition = input<PopoverPosition>();
  readonly delay = input(0);

  // State
  readonly options = computed(() => {
    const o = this.defaultOptions || {};
    const options: TooltipOptions = {
      showDelay: this.delay() || o.showDelay || 0,
      hideDelay: o.hideDelay || 0,
      position: this.ngbTooltipPosition() || o.position || 'top',
      component: this.defaultOptions?.component || o.component,
    };
    return options;
  });
  timer: any;

  constructor() {
    let active = false;
    afterRenderEffect(() => {
      const content = this.ngbTooltip();
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
        this.ngbTooltip()!,
        options.position!,
        this.quickHide,
        options.component,
      );
      return;
    }
    this.timer = setTimeout(() => {
      this.tooltipService.insert(
        this.el.nativeElement,
        this.ngbTooltip()!,
        options.position!,
        this.hide,
        options.component,
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
