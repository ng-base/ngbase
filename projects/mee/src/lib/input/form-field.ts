import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { uniqueId } from '@meeui/ui/utils';
import { InputError } from './error';

@Component({
  selector: 'mee-form-field, [meeFormField]',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class FormField {
  readonly control = contentChild(NgControl, { descendants: true });
  readonly id = uniqueId();

  readonly errors = contentChildren(InputError);
  readonly hasErrors = computed(() => this.errors().some(e => e.isInvalid()));
}
