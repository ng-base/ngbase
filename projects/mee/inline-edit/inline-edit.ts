import { Component } from '@angular/core';
import {
  NgbInlineEdit,
  NgbInlineInput,
  NgbInlineValue,
  provideInlineEdit,
} from '@ngbase/adk/inline-edit';

@Component({
  selector: 'mee-inline-edit',
  imports: [NgbInlineInput, NgbInlineValue],
  providers: [provideInlineEdit(), { provide: NgbInlineEdit, useExisting: InlineEdit }],
  template: `
    @if (isEditing()) {
      <input
        ngbInlineInput
        class="rounded p-1 drop-shadow-md focus:border-transparent focus:outline-none"
      />
    } @else {
      <div ngbInlineValue class="cursor-pointer p-1">{{ localValue() }}</div>
    }
  `,
})
export class InlineEdit extends NgbInlineEdit {}
