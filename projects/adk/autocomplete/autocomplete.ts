import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  contentChildren,
  effect,
  Type,
} from '@angular/core';
import { NgbChip } from '@ngbase/adk/chip';
import { NgbSelectOptionGroup, SelectBase } from '@ngbase/adk/select';
import { provideValueAccessor } from '@ngbase/adk/utils';
import { NgbAutocompleteInput } from './autocomplete-input';

@Component({
  selector: '[ngbAutocomplete]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [_provide(NgbAutocomplete)],
  imports: [NgbSelectOptionGroup],
  template: `
    <ul #container (click)="prevent($event)">
      <ng-content select="ngb-chip, ngb-chip-group" />

      <li (click)="open()">
        <ng-content select="input" />
      </li>
    </ul>
    <ng-template #optionsTemplate>
      <div #optionsGroup ngbSelectOptionGroup class="p-b">
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class NgbAutocomplete<T> extends SelectBase<T> {
  searchInput = contentChild(NgbAutocompleteInput);
  chips = contentChildren(NgbChip);

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
      searchInput.ngbAutocompleteInput.emit('');
      searchInput.updateValue(this.cValue());
    }
  }
}

function _provide<T>(autocomplete: Type<NgbAutocomplete<T>>) {
  return [{ provide: SelectBase, useExisting: autocomplete }, provideValueAccessor(autocomplete)];
}

export function provideAutocomplete<T>(autocomplete: Type<NgbAutocomplete<T>>) {
  const deps = [_provide(autocomplete), { provide: NgbAutocomplete, useExisting: autocomplete }];
  return deps;
}
