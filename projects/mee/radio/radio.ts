import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbRadio, NgbRadioGroup, NgbRadioIndicator } from '@ngbase/adk/radio';
import { ɵFocusStyle as FocusStyle } from '@meeui/ui/checkbox';

@Component({
  selector: 'mee-radio-group',
  hostDirectives: [{ directive: NgbRadioGroup, inputs: ['value'], outputs: ['valueChange'] }],
  template: `<ng-content />`,
  host: {
    class: 'flex gap-2',
  },
})
export class RadioGroup {}

@Component({
  selector: 'mee-radio, [meeRadio]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: NgbRadio, inputs: ['value', 'disabled'] }],
  imports: [FocusStyle, NgbRadioIndicator],
  template: `
    <button
      meeFocusStyle
      ngbRadioIndicator
      class="custom-radio relative flex h-4 w-4 flex-none items-center justify-center rounded-full border border-primary group-aria-[disabled='true']:border-muted"
    >
      <div class="h-2 w-2 rounded-full bg-primary group-aria-[disabled='true']:bg-muted"></div>
    </button>
    <ng-content />
  `,
  host: {
    class:
      'flex items-center gap-2 py-1 cursor-pointer aria-[disabled="true"]:opacity-40 aria-[disabled="true"]:cursor-not-allowed group',
  },
})
export class Radio {}
