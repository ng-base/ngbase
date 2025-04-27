import { ChangeDetectionStrategy, Component, Signal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Autocomplete, AutocompleteInput } from '@meeui/ui/autocomplete';
import { Chip, ChipGroup } from '@meeui/ui/chip';
import { Option } from '@meeui/ui/select';
import { Heading } from '@meeui/ui/typography';
import { filterFunction } from '@ngbase/adk/utils';
import { DocCode, getCode } from '../code.component';
import { FormField, Label } from '@meeui/ui/form-field';

@Component({
  selector: 'app-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Heading,
    FormField,
    Label,
    Autocomplete,
    AutocompleteInput,
    Option,
    Chip,
    ChipGroup,
    DocCode,
  ],
  template: `
    <h4 meeHeader="sm" class="mb-5" id="autocompletePage">Autocomplete</h4>

    <app-doc-code [tsCode]="tsCode()" [adkCode]="adkCode()">
      <div class="flex flex-col gap-2">
        <!-- Value: {{ selectValue2.value() }} -->
        <mee-form-field class="w-72 md:w-96">
          <label meeLabel>Autocomplete</label>
          <mee-autocomplete [(ngModel)]="selectValue2.value" class="w-72 md:w-96">
            <input
              placeholder="Search options"
              [(ngModel)]="selectValue2.optionsFilter.search"
              meeAutocompleteInput
            />
            @for (item of selectValue2.optionsFilter.filteredList(); track item) {
              <mee-option [value]="item">{{ item }}</mee-option>
            }
          </mee-autocomplete>
        </mee-form-field>
        <!-- Value: {{ selectValue.value() | json }} -->
        <mee-form-field class="w-72 md:w-96">
          <label meeLabel>Autocomplete Chip</label>
          <mee-autocomplete [(ngModel)]="selectValue.value" class="w-72 md:w-96" [multiple]="true">
            <mee-chip-group>
              @for (value of selectValue.value(); track value) {
                <mee-chip [value]="value">{{ value }}</mee-chip>
              }
            </mee-chip-group>
            <input
              placeholder="Search options"
              meeAutocompleteInput
              isChip
              [(ngModel)]="selectValue.optionsFilter.search"
            />
            @for (item of selectValue.optionsFilter.filteredList(); track item) {
              <mee-option [value]="item">{{ item }}</mee-option>
            }
          </mee-autocomplete>
        </mee-form-field>
        <mee-form-field class="w-72 md:w-96">
          <label meeLabel>Autocomplete count</label>
          <mee-autocomplete [(ngModel)]="selectValue1.value" class="w-72 md:w-96" [multiple]="true">
            <input
              placeholder="Search options"
              [(ngModel)]="selectValue1.optionsFilter.search"
              meeAutocompleteInput
            />
            @for (item of selectValue1.optionsFilter.filteredList(); track item) {
              <mee-option [value]="item">{{ item }}</mee-option>
            }
          </mee-autocomplete>
        </mee-form-field>
      </div>
    </app-doc-code>
  `,
})
export default class AutocompleteComponent {
  selectValue = new AutocompleteForm<string[]>(['Option 1']);
  selectValue1 = new AutocompleteForm<string[]>(['Option 1']);
  selectValue2 = new AutocompleteForm<string>('Option 1');

  tsCode = getCode('autocomplete/autocomplete-usage.ts');

  adkCode = getCode('autocomplete/autocomplete-adk.ts');
}

class AutocompleteForm<T> {
  value!: Signal<T>;
  options = Array.from({ length: 50 }, (_, i) => `Option ${i + 1}`);
  optionsFilter = filterFunction(this.options, () => ({
    filter: option => option,
  }));

  constructor(value: T) {
    this.value = signal(value);
  }
}
