import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { injectTheme } from '@meeui/ui/theme';
import { NgbPopoverArrow, providePopoverArrowTracker } from '@ngbase/adk/popover';
import {
  NgbTooltip,
  NgbTooltipTemplate,
  provideNgbTooltipOptions,
  tooltipAnimation,
  TooltipOptions,
} from '@ngbase/adk/tooltip';

@Directive({
  selector: '[meeTooltip]',
  hostDirectives: [
    {
      directive: NgbTooltip,
      inputs: ['ngbTooltip: meeTooltip', 'ngbTooltipPosition: meeTooltipPosition', 'delay'],
    },
  ],
})
export class Tooltip {}

@Component({
  selector: 'mee-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providePopoverArrowTracker()],
  imports: [NgbPopoverArrow],
  template: `<div ngbPopoverArrow>{{ content() }}</div>`,
  host: {
    class:
      'fixed inline-block rounded-lg bg-background px-3 py-1 border shadow-md z-p whitespace-pre-line max-w-[15rem] text-text',
    '[class]': `theme.mode() === 'dark' ? 'light' : 'dark'`,
  },
  animations: [tooltipAnimation],
})
export class TooltipComponent extends NgbTooltipTemplate {
  readonly theme = injectTheme();
}

export const provideTooltipOptions = (options: TooltipOptions) =>
  provideNgbTooltipOptions({ ...options, component: TooltipComponent });
