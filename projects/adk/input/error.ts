import { computed, Directive, effect, inject, input, signal, Signal } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MeeFormField } from './form-field';

@Directive({
  selector: '[meeError]',
  host: {
    '[hidden]': '!isInvalid()',
  },
})
export class MeeInputError {
  private readonly formField = inject(MeeFormField);
  private readonly statusChanges = statusChange(this.formField.control);
  /* the input can have comma separated error names like
   * 'required' or '!required && minlength'
   */
  readonly meeError = input.required<string>();
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
    const control = this.formField.control();
    const status = this.statusChanges();
    const names = this.errorNames();

    return (
      status === 'INVALID' &&
      control?.touched &&
      names.every(n => !!control.errors?.[n.name] !== n.negated)
    );
  });
}

function statusChange(sControl: Signal<NgControl | undefined>): Signal<string | null> {
  const statusChanges = signal<string | null>(null, { equal: (a, b) => false });
  effect(cleanup => {
    const control = sControl();
    if (control) {
      const sub = control.statusChanges?.subscribe(() => {
        statusChanges.set(control.status);
      });
      cleanup(() => sub?.unsubscribe());
    }
  });
  return statusChanges;
}
