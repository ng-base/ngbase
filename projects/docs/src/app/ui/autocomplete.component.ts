import { ChangeDetectionStrategy, Component, Signal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Autocomplete, AutocompleteInput } from '@meeui/ui/autocomplete';
import { Chip, ChipGroup } from '@meeui/ui/chip';
import { Option } from '@meeui/ui/select';
import { Heading } from '@meeui/ui/typography';
import { filterFunction } from '@meeui/adk/utils';
import { DocCode } from './code.component';

@Component({
  selector: 'app-autocomplete',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Heading,
    Autocomplete,
    AutocompleteInput,
    Option,
    Chip,
    ChipGroup,
    DocCode,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader="sm" class="mb-5" id="autocompletePage">Autocomplete</h4>

    <app-doc-code [tsCode]="tsCode">
      <h4 meeHeader class="mb-b2">Autocomplete</h4>
      <!-- Value: {{ selectValue2.value() }} -->
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

      <h4 meeHeader class="mb-b2 mt-5" id="autocompletePage">Autocomplete Chip</h4>
      <!-- Value: {{ selectValue.value() | json }} -->
      <mee-autocomplete [(ngModel)]="selectValue.value" class="w-72 md:w-96" [multiple]="true">
        <mee-chip-group>
          @for (value of selectValue.value(); track value) {
            <mee-chip [value]="value">{{ value }}</mee-chip>
          }
        </mee-chip-group>
        <input
          placeholder="Search options"
          meeAutocompleteInput
          [(ngModel)]="selectValue.optionsFilter.search"
        />
        @for (item of selectValue.optionsFilter.filteredList(); track item) {
          <mee-option [value]="item">{{ item }}</mee-option>
        }
      </mee-autocomplete>

      <h4 meeHeader class="mb-b2 mt-5" id="autocompletePage">Autocomplete count</h4>
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
    </app-doc-code>
  `,
})
export class AutocompleteComponent {
  selectValue = new AutocompleteForm<string[]>(['Option 1']);
  selectValue1 = new AutocompleteForm<string[]>(['Option 1']);
  selectValue2 = new AutocompleteForm<string>('Option 1');

  tsCode = `
  import { Component } from '@angular/core';
  import { FormControl, ReactiveFormsModule } from '@angular/forms';
  import { Autocomplete, AutocompleteInput } from '@meeui/ui/autocomplete';
  import { Option } from '@meeui/ui/select';

  @Component({
    selector: 'app-root',
    imports: [ReactiveFormsModule, Autocomplete, AutocompleteInput, Option],
    template: \`
      <mee-autocomplete [(ngModel)]="value" class="w-full">
        <input
          meeAutocompleteInput
          placeholder="Search options"
          [formControl]="search"
        />
        @for (item of optionsFilter(); track item) {
          <mee-option [value]="item">{{ item }}</mee-option>
        }
      </mee-autocomplete>
    \`
  })
  export class AppComponent {
    value = signal(value);
    
    search = signal('');
    
    options = Array.from({ length: 50 }, (_, i) => \`Option $\{i + 1}\`);
    optionsFilter = computed(() => {
      const search = this.search().toLowerCase();
      return this.options.filter(option => option.toLowerCase().includes(search));
    });
  }
  `;
}

class AutocompleteForm<T> {
  value!: Signal<T>;
  options = Array.from({ length: 50 }, (_, i) => `Option ${i + 1}`);
  optionsFilter = filterFunction(this.options, { filter: option => option });

  constructor(value: T) {
    this.value = signal(value);
  }
}
