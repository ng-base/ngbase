import { ChangeDetectionStrategy, Component, Signal, computed, signal } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Option } from '@meeui/select';
import { Autocomplete, AutocompleteInput } from '@meeui/autocomplete';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';
import { Chip } from '@meeui/chip';

@Component({
  standalone: true,
  selector: 'app-autocomplete',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Heading,
    Autocomplete,
    AutocompleteInput,
    Option,
    JsonPipe,
    Chip,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader="sm" class="mb-5" id="autocompletePage">Autocomplete</h4>

    <h4 meeHeader class="mb-b2">Autocomplete</h4>
    <!-- Value: {{ selectValue2.value() }} -->
    <mee-autocomplete [(ngModel)]="selectValue2.value" class="w-full">
      <input
        placeholder="Search options"
        [formControl]="selectValue2.search"
        meeAutocompleteInput
      />
      @for (item of selectValue2.optionsFilter(); track item) {
        <mee-option [value]="item">{{ item }}</mee-option>
      }
    </mee-autocomplete>

    <h4 meeHeader class="mb-b2 mt-5" id="autocompletePage">Autocomplete Chip</h4>
    <!-- Value: {{ selectValue.value() | json }} -->
    <mee-autocomplete [(ngModel)]="selectValue.value" class="w-full" [multiple]="true">
      @for (value of selectValue.value(); track value) {
        <mee-chip>{{ value }}</mee-chip>
      }
      <input placeholder="Search options" meeAutocompleteInput [formControl]="selectValue.search" />
      @for (item of selectValue.optionsFilter(); track item) {
        <mee-option [value]="item">{{ item }}</mee-option>
      }
    </mee-autocomplete>

    <h4 meeHeader class="mb-b2 mt-5" id="autocompletePage">Autocomplete count</h4>
    <mee-autocomplete [(ngModel)]="selectValue1.value" class="w-full" [multiple]="true">
      <input
        placeholder="Search options"
        [formControl]="selectValue1.search"
        meeAutocompleteInput
      />
      @for (item of selectValue1.optionsFilter(); track item) {
        <mee-option [value]="item">{{ item }}</mee-option>
      }
    </mee-autocomplete>
  `,
})
export class AutocompleteComponent {
  selectValue = new AutocompleteForm<string[]>(['Option 1']);
  selectValue1 = new AutocompleteForm<string[]>(['Option 1']);
  selectValue2 = new AutocompleteForm<string>('Option 1');
}

class AutocompleteForm<T> {
  value!: Signal<T>;
  search = new FormControl('');
  searchChange = toSignal(this.search.valueChanges);
  options = Array.from({ length: 50 }, (_, i) => `Option ${i + 1}`);
  optionsFilter = computed(() => {
    const search = (this.searchChange() || '').toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(search));
  });

  constructor(value: T) {
    this.value = signal(value);
  }
}
