import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { InputBase, MeeFormField, MeeInputError, MeeLabel } from '@meeui/adk/input';
import { InputStyle } from './input-style.directive';

@Component({
  selector: 'mee-form-field, [meeFormField]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [MeeFormField],
  template: `
    <ng-content select="[meeLabel]" />
    <ng-content select="[meeDescription]" />
    <div class="flex items-center">
      <ng-content />
    </div>
    <ng-content select="[meeError]" />
  `,
  host: {
    class: 'inline-flex flex-col font-medium mb-b2 gap-b text-left',
  },
})
export class FormField {}

@Directive({
  selector: '[meeInput]',
  hostDirectives: [{ directive: InputBase, inputs: ['value'] }, InputStyle],
  host: {
    class: 'focus:outline-none',
    '[class.border-red-500]': 'formField?.hasErrors()',
  },
})
export class Input<T = unknown> {}

@Component({
  selector: '[meeLabel]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [MeeLabel],
  template: `<ng-content />`,
  host: {
    class: 'block font-medium text-left mx-b0.5',
  },
})
export class Label {}

@Directive({
  selector: '[meeDescription]',
  host: {
    class: 'text-sm text-muted',
  },
})
export class Description {}

@Directive({
  selector: '[meeInputPrefix]',
  hostDirectives: [InputStyle],
})
export class InputPrefix {}

@Directive({
  selector: '[meeError]',
  hostDirectives: [{ directive: MeeInputError, inputs: ['meeError'] }],
  host: {
    class: 'text-red-500 mx-b0.5',
  },
})
export class InputError {}
