import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  contentChildren,
  effect,
  Type,
} from '@angular/core';
import { MeeChip } from '@meeui/adk/chip';
import { MeeSelectOptionGroup, SelectBase } from '@meeui/adk/select';
import { provideValueAccessor } from '@meeui/adk/utils';
import { MeeAutocompleteInput } from './autocomplete-input';

@Component({
  selector: '[meeAutocomplete]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [_provide(MeeAutocomplete)],
  imports: [MeeSelectOptionGroup],
  template: `
    <ul #container (click)="prevent($event)">
      <ng-content select="mee-chip, mee-chip-group" />

      <li (click)="open()">
        <ng-content select="input" />
      </li>
    </ul>
    <ng-template #optionsTemplate>
      <div #optionsGroup meeSelectOptionGroup class="p-b">
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class MeeAutocomplete<T> extends SelectBase<T> {
  searchInput = contentChild(MeeAutocompleteInput);
  chips = contentChildren(MeeChip);

  constructor() {
    super(false);
    effect(() => {
      if (this.status() !== 'opened') this.updateInputValue();
    });
  }

  prevent(ev: MouseEvent) {
    ev.stopPropagation();
  }

  private updateInputValue() {
    const searchInput = this.searchInput();
    if (!this.chips()?.length && searchInput) {
      searchInput.meeAutocompleteInput.emit('');
      searchInput.updateValue(this.cValue());
    }
  }
}

function _provide<T>(autocomplete: Type<MeeAutocomplete<T>>) {
  return [{ provide: SelectBase, useExisting: autocomplete }, provideValueAccessor(autocomplete)];
}

export function provideAutocomplete<T>(autocomplete: Type<MeeAutocomplete<T>>) {
  const deps = [_provide(autocomplete), { provide: MeeAutocomplete, useExisting: autocomplete }];
  return deps;
}
