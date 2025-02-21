import {
  computed,
  contentChild,
  contentChildren,
  Directive,
  effect,
  forwardRef,
  signal,
  Signal,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { uniqueId } from '@ngbase/adk/utils';
import { NgbInputError } from './error';

@Directive({
  selector: 'ngb-form-field, [ngbFormField]',
})
export class NgbFormField {
  readonly _control = contentChild(NgControl, { descendants: true });
  readonly _id = uniqueId();

  // we need to forwardRef the error component to avoid circular dependency
  readonly status = statusChange(this._control);
  private readonly _invalid = computed(
    () => this.status() === 'INVALID' && this._control()?.touched,
  );

  readonly errors = contentChildren<NgbInputError>(forwardRef(() => NgbInputError));
  readonly hasErrors = computed(() => this._invalid() || this.errors().some(e => e.isInvalid()));
}

function statusChange(sControl: Signal<NgControl | undefined>): Signal<string | null> {
  const statusChanges = signal<string | null>(null, { equal: () => false });
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
