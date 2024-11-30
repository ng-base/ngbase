import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeFormField } from '@meeui/adk/input';

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
  hostDirectives: [{ directive: MeeFormField }],
})
export class FormField {}
