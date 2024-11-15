import { computed, Directive, effect, inject, input, signal, Signal } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormField } from './form-field';

@Directive({
  selector: '[meeError]',
  host: {
    class: 'text-red-500 mx-b0.5',
    '[class.hidden]': '!isInvalid()',
  },
})
export class InputError {
  private readonly formField = inject(FormField);
  private readonly statusChanges = statusChange(this.formField.control);
  readonly meeError = input.required<string>();

  readonly isInvalid = computed(() => {
    const control = this.formField.control();
    const status = this.statusChanges();
    const name = this.meeError() ?? '';
    return status === 'INVALID' && control?.touched && control.errors?.[name];
  });
}

function statusChange(sControl: Signal<NgControl | undefined>): Signal<string | null> {
  const statusChanges = signal<string | null>(null);
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
