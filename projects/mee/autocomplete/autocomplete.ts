import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeAutocomplete, provideAutocomplete } from '@meeui/adk/autocomplete';
import { MeeSelectOptionGroup } from '@meeui/adk/select';
import { InputStyle } from '@meeui/ui/input';

@Component({
  selector: 'mee-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideAutocomplete(Autocomplete)],
  imports: [InputStyle, MeeSelectOptionGroup],
  template: `
    <ul
      #container
      meeInputStyle
      class="readonly !flex w-full flex-wrap gap-2"
      (click)="prevent($event)"
    >
      <ng-content select="mee-chip, mee-chip-group" />

      <li class="flex min-w-8 flex-1 items-center" (click)="open()">
        <ng-content select="input" />
      </li>
    </ul>
    <ng-template #options>
      <div #optionsGroup meeSelectOptionGroup class="p-b">
        <ng-content />
      </div>
    </ng-template>
  `,
  host: {
    class: 'inline-flex',
  },
})
export class Autocomplete<T> extends MeeAutocomplete<T> {}
