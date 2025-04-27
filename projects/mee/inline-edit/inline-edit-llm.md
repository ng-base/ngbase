# Inline Edit

```typescript
import { InlineEdit } from '@/ui/inline-edit';
```

## Components

### `mee-inline-edit`

- **Inputs**
  - `value`: string - The value of the input (2way)
  - `editOn`: 'click' | 'dblclick' = 'dblclick' - The event to trigger the edit
- **Outputs**
  - `valueChange`: EventEmitter<string> - The event emitter for the value change

## Usage

```html
<mee-inline-edit [value]="value" [editOn]="editOn" (valueChange)="onValueChange($event)" />
<mee-inline-edit [(value)]="value" />
```
