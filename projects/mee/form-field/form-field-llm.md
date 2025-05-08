# MEE Form Field

```typescript
import { Icon } from '@/ui/icon';
import {
  FormField,
  Label,
  Description,
  InputPrefix,
  InputSuffix,
  InputError,
  MeeInput,
} from '@/ui/form-field';
```

## Components

### `mee-form-field, [meeFormField]`

### `[meeLabel]`

### `[meeDescription]`

### `[meePrefix]`

### `[meeSuffix]`

### `[meeError]`

- **Inputs**
  - `meeError`: string - condition to show the error similar to ngIf

### `[meeInput]`

- **Inputs**
  - `value`: string - The value of the input (2way)
- **Outputs**
  - `valueChange`: EventEmitter<string> - The event emitter for the value change

## Usage

```html
<mee-form-field>
  <label meeLabel>Label</label>
  <p meeDescription>Description</p>
  <mee-icon meePrefix name="info" />
  <input meeInput [(value)]="value" />
  <mee-icon meeSuffix name="info" />
  <p meeError="required">Error</p>
  <p meeError="!required && minlength">Error</p>
</mee-form-field>

<mee-form-field>
  <input meeInput [(ngModel)]="value" />
</mee-form-field>
```

Note: Use `mee-form-field` to wrap the `meeInput`, `mee-select` or `mee-autocomplete` and label. Never use any input, select or autocomplete directly.
