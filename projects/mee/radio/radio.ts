import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeRadio, MeeRadioIndicator } from '@meeui/adk/radio';
import { ɵFocusStyle as FocusStyle } from '@meeui/ui/checkbox';

@Component({
  selector: 'mee-radio, [meeRadio]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: MeeRadio, inputs: ['value', 'disabled'] }],
  imports: [FocusStyle, MeeRadioIndicator],
  template: `
    <button
      meeFocusStyle
      meeRadioIndicator
      #radioIndicator
      class="custom-radio relative flex h-b4 w-b4 flex-none items-center justify-center rounded-full border border-primary"
      [class]="radioIndicator.disabled() ? 'border-muted' : 'border-primary'"
    >
      <div
        class="h-b2 w-b2 rounded-full"
        [class]="radioIndicator.disabled() ? 'bg-muted' : 'bg-primary'"
      ></div>
    </button>
    <ng-content />
  `,
  host: {
    class:
      'flex items-center gap-b2 py-1 cursor-pointer aria-[disabled="true"]:opacity-40 aria-[disabled="true"]:cursor-not-allowed',
  },
})
export class Radio {}
