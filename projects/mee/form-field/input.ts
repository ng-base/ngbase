import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { InputBase, MeeFormField, MeeInputError, MeeLabel, toggleDiv } from '@meeui/adk/form-field';
import { InputStyle } from './input-style.directive';
import { MeeSelectTarget } from '@meeui/adk/select';

@Component({
  selector: 'mee-form-field, [meeFormField]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [MeeFormField, MeeSelectTarget],
  imports: [InputStyle],
  template: `
    <ng-content select="[meeLabel]" />
    <ng-content select="[meeDescription]" />
    <div class="flex items-center" #target meeInputStyle>
      <ng-content select="[meeInputPrefix]" />
      <ng-content />
      <ng-content select="[meeInputSuffix]" />
    </div>
    <ng-content select="[meeError]" />
  `,
  host: {
    class: 'inline-flex flex-col font-medium mb-b2 gap-b',
  },
})
export class FormField {
  readonly selectTarget = inject(MeeSelectTarget);
  readonly target = viewChild.required<ElementRef<HTMLDivElement>>('target');
  private _ = effect(() => {
    this.selectTarget.target.set(this.target().nativeElement);
  });
}

@Directive({
  selector: '[meeInput]',
  hostDirectives: [{ directive: InputBase, inputs: ['value'] }],
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
    class: 'block font-medium mx-b0.5',
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
})
export class InputPrefix {}

@Component({
  selector: '[meeError]',
  hostDirectives: [{ directive: MeeInputError, inputs: ['meeError'] }],
  template: `<ng-content />`,
  host: {
    class: 'text-red-500 mx-b0.5',
    '[@toggleDiv]': 'isInvalid() ? "visible" : "hidden"',
  },
  animations: [toggleDiv],
})
export class InputError {
  readonly error = inject(MeeInputError);
  readonly isInvalid = this.error.isInvalid;

  constructor() {
    this.error.animate.set(true);
  }
}
