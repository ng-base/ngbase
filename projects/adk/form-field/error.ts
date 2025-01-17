import { animate, state, style, transition, trigger } from '@angular/animations';
import { computed, Directive, inject, input, signal } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { MeeFormField } from './form-field';

@Directive({
  selector: '[meeError]',
  host: {
    '[hidden]': '!animate() && !isInvalid()',
  },
})
export class MeeInputError {
  private readonly formField = inject(MeeFormField);
  /* the input can have comma separated error names like
   * 'required' or '!required && minlength'
   */
  readonly meeError = input.required<string>();
  readonly animate = signal(false);

  private readonly errorNames = computed(() => {
    const names = (this.meeError() ?? '').split('&&');
    return names.reduce(
      (acc, n) => {
        const trimmed = n.trim();
        if (trimmed) {
          const negated = trimmed.startsWith('!');
          acc.push({ name: trimmed.slice(negated ? 1 : 0), negated });
        }
        return acc;
      },
      [] as { name: string; negated: boolean }[],
    );
  });

  readonly isInvalid = computed(() => {
    const control = this.formField._control();
    const status = this.formField.status();
    const names = this.errorNames();

    return (
      status === 'INVALID' &&
      control?.touched &&
      names.every(n => !!control.errors?.[n.name] !== n.negated)
    );
  });
}

export function markControlsTouched(
  control: AbstractControl,
  options = { touched: true, dirty: false },
) {
  if (control instanceof FormGroup || control instanceof FormArray) {
    Object.values(control.controls).forEach(c => markControlsTouched(c, options));
  }
  if (options.dirty) control.markAsTouched();
  if (options.touched) control.markAsTouched();
  control.updateValueAndValidity();
}

export const toggleDiv = trigger('toggleDiv', [
  state('hidden', style({ opacity: 0, height: '0px', visibility: 'hidden' })),
  state('visible', style({ opacity: 1, height: '*', visibility: 'visible' })),
  transition('hidden <=> visible', [animate('150ms ease-in-out')]),
]);
