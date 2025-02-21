import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Autocomplete, AutocompleteInput } from '@meeui/ui/autocomplete';
import { Option } from '@meeui/ui/select';

@Component({
  selector: 'app-root',
  imports: [FormsModule, Autocomplete, AutocompleteInput, Option],
  template: `
    <mee-autocomplete [(ngModel)]="value" class="w-full">
      <input meeAutocompleteInput placeholder="Search options" [(ngModel)]="search" />
      @for (item of optionsFilter(); track item) {
        <mee-option [value]="item">{{ item }}</mee-option>
      }
    </mee-autocomplete>
  `,
})
export class AppComponent {
  value = signal('');

  search = signal('');

  options = Array.from({ length: 50 }, (_, i) => `Option ${i + 1}`);
  optionsFilter = computed(() => {
    const search = this.search().toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(search));
  });
}
