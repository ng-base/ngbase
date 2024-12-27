import { computed, contentChild, contentChildren, Directive, forwardRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { uniqueId } from '@meeui/adk/utils';
import { MeeInputError } from './error';

@Directive({
  selector: 'mee-form-field, [meeFormField]',
})
export class MeeFormField {
  readonly _control = contentChild(NgControl, { descendants: true });
  readonly _id = uniqueId();

  // we need to forwardRef the error component to avoid circular dependency
  readonly errors = contentChildren<MeeInputError>(forwardRef(() => MeeInputError));
  readonly hasErrors = computed(() => this.errors().some(e => e.isInvalid()));
}
