import { Component } from '@angular/core';
import {
  MeeInlineEdit,
  MeeInlineInput,
  MeeInlineValue,
  provideInlineEdit,
} from '@meeui/adk/inline-edit';

@Component({
  selector: 'mee-inline-edit',
  imports: [MeeInlineInput, MeeInlineValue],
  providers: [provideInlineEdit(), { provide: MeeInlineEdit, useExisting: InlineEdit }],
  template: `
    @if (isEditing()) {
      <input
        meeInlineInput
        class="rounded p-1 drop-shadow-md focus:border-transparent focus:outline-none"
      />
    } @else {
      <div meeInlineValue class="cursor-pointer p-1">{{ localValue() }}</div>
    }
  `,
})
export class InlineEdit extends MeeInlineEdit {}
