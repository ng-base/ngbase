import { animate, state, style, transition, trigger } from '@angular/animations';
import { computed, Directive, inject, input, signal } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { NgbFormField } from './form-field';

@Directive({
  selector: '[ngbError]',
  host: {
    '[hidden]': '!animate() && !isInvalid()',
  },
})
export class NgbInputError {
  private readonly formField = inject(NgbFormField);
  /* the input can have comma separated error names like
   * 'required' or '!required && minlength'
   */
  readonly ngbError = input.required<string>();
  readonly invalid = input<boolean>();
  readonly animate = signal(false);

  private readonly errorNames = computed(() => {
    const names = (this.ngbError() ?? '').split('&&');
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

  readonly isFieldInvalid = computed(() => {
    const control = this.formField._control();
    const status = this.formField.status();
    const names = this.errorNames();

    return (
      status === 'INVALID' &&
      control?.touched &&
      names.every(n => !!control.errors?.[n.name] !== n.negated)
    );
  });

  readonly isInvalid = computed(() => {
    return this.invalid() ?? this.isFieldInvalid();
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
