# MEE Autocomplete

```typescript
import { FormField, Label } from '@/ui/form-field';
import { Autocomplete, AutocompleteInput } from '@/ui/autocomplete';
import { Option } from '@/ui/select';
```

## Components

### `<mee-autocomplete>`

- **Inputs:**

  - `value`: any[] | any - Selected value (2way)
  - `disabled`: boolean = false - Disable the autocomplete (2way)
  - `multiple`: boolean = false - Allow multiple selection
  - `noAutoClose`: boolean = false - Prevent auto close
  - `options`: any[] - Options
  - `placeholder`: string = ' ' - Placeholder text
  - `size`: 'target' | 'free' = 'free' - Size of the autocomplete
  - `filterFn`: (option: any) => boolean = (option: any) => true - Filter function
  - `queryFn`: (query: string, option: any) => boolean = (query: string, option: any) => true - Query function
  - `filterOptions`: FilterOptions<any> - Filter options

- **Outputs:**

  - `opened`: boolean - Open state
  - `closed`: boolean - Close state

- **Methods:**

  - `open()`: void - Open the autocomplete
  - `close()`: void - Close the autocomplete

- **Export:** `#autocomplete="meeAutocomplete"` - Template reference

### `[meeAutocompleteInput]`

- **Inputs:**

  - `isChip`: boolean = false - Use chip style
  - `placeholder`: string = ' ' - Placeholder text
  - `value`: string = '' - Value (2way)

- **Outputs:**

  - `ngbAutocompleteInput: meeAutocompleteInput` - Autocomplete input event (2way)

- **Export:** `#autocompleteInput="meeAutocompleteInput"` - Template reference

### `<mee-option>`

- **Inputs:**

  - `value`: any - Option value

- **Export:** `#option="meeOption"` - Template reference

## Usage

```html
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
```
