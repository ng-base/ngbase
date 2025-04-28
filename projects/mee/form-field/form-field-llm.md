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
  <input meeInput [(value)]="value" />
  <p meeDescription>Description</p>
  <p meeError="required">Error</p>
  <p meeError="!required && minlength">Error</p>
  <mee-icon meePrefix name="info" />
  <mee-icon meeSuffix name="info" />
</mee-form-field>

<mee-form-field>
  <input meeInput [(ngModel)]="value" />
</mee-form-field>
```
