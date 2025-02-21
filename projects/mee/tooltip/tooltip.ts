import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  NgbTooltipTemplate,
  provideNgbTooltipOptions,
  TooltipOptions,
  NgbTooltip,
} from '@ngbase/adk/tooltip';
import { injectTheme } from '@meeui/ui/theme';

@Directive({
  selector: '[meeTooltip]',
  hostDirectives: [
    { directive: NgbTooltip, inputs: ['ngbTooltip', 'ngbTooltipPosition', 'delay'] },
  ],
})
export class Tooltip {}

@Component({
  selector: 'mee-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ content() }}`,
  host: {
    class:
      'fixed inline-block rounded-base bg-foreground px-b3 py-b border shadow-md z-p whitespace-pre-line max-w-[15rem] text-text',
    '[class]': `theme.mode() === 'dark' ? 'light' : 'dark'`,
  },
})
export class TooltipComponent extends NgbTooltipTemplate {
  readonly theme = injectTheme();
}

export const provideTooltipOptions = (options: TooltipOptions) =>
  provideNgbTooltipOptions({ ...options, component: TooltipComponent });
