# MEE Checkbox

```typescript
import { Checkbox } from '@meeui/ui/checkbox';
```

## Component

### `<mee-checkbox>`

- **Inputs:**

  - `disabled`: boolean - Whether the checkbox is disabled
  - `checked`: boolean - Whether the checkbox is checked (2way)
  - `indeterminate`: boolean - Whether the checkbox is indeterminate

- **Outputs:**

  - `checkedChange`: boolean - Whether the checkbox is checked
  - `change`: boolean - Whether the checkbox is checked

## Usage

```html
<mee-checkbox [checked]="true" (checkedChange)="onChange($event)" />
<mee-checkbox [(checked)]="property" />
```
