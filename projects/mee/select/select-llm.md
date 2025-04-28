# Select

```typescript
import { FormField, Label } from '@/ui/form-field';
import { Select, Option, OptionGroup, SelectInput } from '@/ui/select';
```

## Components

### `mee-select`

- **Inputs**

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

- **Outputs**

  - `opened`: boolean - Open state
  - `closed`: boolean - Close state

- **Methods**

  - `open()`: void - Open the select
  - `close()`: void - Close the select

- **Export** - `#select="meeSelect"` - Template reference

### `mee-option`

- **Inputs**

  - `value`: any - The value of the option
  - `disabled`: boolean = false - Disable the option

- **Export** - `#option="meeOption"` - Template reference

### `mee-option-group`

- **Inputs**

  - `label`: string - The label of the option group

- **Export** - `#optionGroup="meeOptionGroup"` - Template reference

### `mee-select-input`

- **Inputs**

  - `placeholder`: string = ' ' - Placeholder text
  - `value`: string = '' - Value (2way)

- **Export** - `#selectInput="meeSelectInput"` - Template reference

## Usage

```html
<mee-form-field>
  <label meeLabel>Select</label>
  <mee-select [(value)]="value">
    <mee-option value="1">Option 1</mee-option>
    <mee-option value="2">Option 2</mee-option>
    <mee-option value="3">Option 3</mee-option>
  </mee-select>
</mee-form-field>

<mee-form-field>
  <mee-select [(ngModel)]="value">
    <mee-option-group label="Group 1">
      <mee-option value="1">Option 1</mee-option>
      <mee-option value="2">Option 2</mee-option>
    </mee-option-group>
    <mee-option-group label="Group 2">
      <mee-option value="3">Option 3</mee-option>
      <mee-option value="4">Option 4</mee-option>
    </mee-option-group>
  </mee-select>
</mee-form-field>
```
