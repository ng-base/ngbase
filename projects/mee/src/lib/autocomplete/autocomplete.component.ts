import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  contentChildren,
  contentChild,
  effect,
  forwardRef,
  viewChild,
  input,
  signal,
  computed,
  afterNextRender,
  untracked,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Option } from '../select';
import { Input } from '../input';
import { NgTemplateOutlet } from '@angular/common';
import { popoverPortal } from '../popover';
import { Subject } from 'rxjs';
import { InputStyle } from '../input/input-style.directive';
import { Chip } from '../chip';
import { AutocompleteInput } from './autocomplete.directive';
import { SelectBase } from '../select/select-base.component';

@Component({
  selector: 'mee-autocomplete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, InputStyle, Chip],
  template: `
    <ul
      #container
      meeInputStyle
      class="readonly !flex flex-wrap gap-2"
      (click)="prevent($event)"
    >
      <ng-content select="mee-chip" />

      <li class="flex min-w-8 flex-1 items-center" (click)="open()">
        <ng-content select="input" />
      </li>
    </ul>
    <ng-template #options>
      <ng-content />
    </ng-template>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Autocomplete),
      multi: true,
    },
  ],
})
export class Autocomplete<T> extends SelectBase<T> {
  selectOptions = contentChildren(Option, { descendants: true });
  searchInput = contentChild(AutocompleteInput);
  chips = contentChildren(Chip);

  constructor() {
    super(false);
    effect(
      () => {
        this.options.set(this.selectOptions());
      },
      { allowSignalWrites: true },
    );
    effect(() => {
      if (this.status() !== 'opened') this.updateInputValue();
    });
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
