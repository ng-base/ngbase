import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  MeeTooltipTemplate,
  provideMeeTooltipOptions,
  TooltipOptions,
  MeeTooltip,
} from '@meeui/adk/tooltip';
import { injectTheme } from '@meeui/ui/theme';

@Directive({
  selector: '[meeTooltip]',
  hostDirectives: [
    { directive: MeeTooltip, inputs: ['meeTooltip', 'meeTooltipPosition', 'delay'] },
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
export class TooltipComponent extends MeeTooltipTemplate {
  readonly theme = injectTheme();
}

export const provideTooltipOptions = (options: TooltipOptions) =>
  provideMeeTooltipOptions({ ...options, component: TooltipComponent });
