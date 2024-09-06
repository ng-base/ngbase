import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  contentChild,
  effect,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { InputStyle } from '../input/input-style.directive';
import { Chip } from '../chip';
import { AutocompleteInput } from './autocomplete.directive';
import { SelectBase } from '../select/select-base.component';
import { AccessibleGroup } from '../a11y';

@Component({
  selector: 'mee-autocomplete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, InputStyle, Chip, AccessibleGroup],
  template: `
    <ul
      #container
      meeInputStyle
      class="readonly !flex w-full flex-wrap gap-2"
      (click)="prevent($event)"
    >
      <ng-content select="mee-chip" />

      <li class="flex min-w-8 flex-1 items-center" (click)="open()">
        <ng-content select="input" />
      </li>
    </ul>
    <ng-template #options>
      <div meeAccessibleGroup [ayId]="ayid">
        <ng-content />
      </div>
    </ng-template>
  `,
  host: {
    class: 'inline-flex',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Autocomplete),
      multi: true,
    },
  ],
})
export class Autocomplete<T> extends SelectBase<T> {
  searchInput = contentChild(AutocompleteInput);
  chips = contentChildren(Chip);

  constructor() {
    super(false);
    effect(
      () => {
        if (this.status() !== 'opened') this.updateInputValue();
      },
      { allowSignalWrites: true },
    );
  }

  prevent(ev: MouseEvent) {
    ev.stopPropagation();
  }

  private updateInputValue() {
    if (!this.chips()?.length) {
      this.searchInput()?.meeAutocompleteInput.emit('');
      this.searchInput()?.updateValue(this.cValue());
    }
  }
}
