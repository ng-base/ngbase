import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import {
  InputBase,
  NgbFormField,
  NgbInputError,
  NgbLabel,
  toggleDiv,
} from '@ngbase/adk/form-field';
import { InputStyle } from './input-style.directive';
import { NgbSelectTarget } from '@ngbase/adk/select';

@Component({
  selector: 'mee-form-field, [meeFormField]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NgbFormField, NgbSelectTarget],
  imports: [InputStyle],
  template: `
    <ng-content select="[meeLabel]" />
    <ng-content select="[meeDescription]" />
    <div class="mt-1 flex items-center" #target meeInputStyle>
      <ng-content select="[meePrefix]" />
      <ng-content />
      <ng-content select="[meeSuffix]" />
    </div>
    <ng-content select="[meeError]" />
  `,
  host: {
    class: 'inline-flex flex-col font-medium gap-1',
  },
})
export class FormField {
  readonly selectTarget = inject(NgbSelectTarget);
  readonly target = viewChild.required<ElementRef<HTMLDivElement>>('target');
  private _ = effect(() => {
    this.selectTarget.target.set(this.target().nativeElement);
  });
}

@Directive({
  selector: '[meeInput]',
  hostDirectives: [{ directive: InputBase, inputs: ['value'], outputs: ['valueChange'] }],
  host: {
    class: 'outline-none w-full bg-transparent',
    '[class.border-red-500]': 'formField?.hasErrors()',
  },
})
export class MeeInput {
  readonly formField = inject(NgbFormField, { optional: true });
}

@Component({
  selector: '[meeLabel]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NgbLabel],
  template: `<ng-content />`,
  host: {
    class: 'block font-medium mx-0.5',
  },
})
export class Label {}

@Directive({
  selector: '[meeDescription]',
  host: {
    class: 'text-sm text-muted-foreground',
  },
})
export class Description {}

@Directive({
  selector: '[meePrefix]',
  host: {
    class: 'mr-2.5',
  },
})
export class InputPrefix {}

@Directive({
  selector: '[meeSuffix]',
  host: {
    class: 'ml-2.5',
  },
})
export class InputSuffix {}

@Component({
  selector: '[meeError]',
  hostDirectives: [{ directive: NgbInputError, inputs: ['ngbError: meeError'] }],
  template: `<ng-content />`,
  host: {
    class: 'text-red-500 mx-0.5',
    '[@toggleDiv]': 'isInvalid() ? "visible" : "hidden"',
  },
  animations: [toggleDiv],
})
export class InputError {
  readonly error = inject(NgbInputError);
  readonly isInvalid = this.error.isInvalid;

  constructor() {
    this.error.animate.set(true);
  }
}
