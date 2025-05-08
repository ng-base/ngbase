# MEE Chip

```typescript
import { Chip, ChipGroup } from '@meeui/ui/chip';
```

## Components

### `<mee-chip-group>`

### `<mee-chip>, [meeChip]`

- **Inputs:**

  - `removable`: boolean - Whether the chip is removable
  - `value`: any - The value of the chip

- **Outputs:**

  - `close`: PointerEvent - Emits when the close button is clicked

## Usage

```html
<mee-chip-group>
  <mee-chip [value]="item" [removable]="true">Text</mee-chip>
  <button meeChip [value]="item" [removable]="true">Text</button>
</mee-chip-group>
```
