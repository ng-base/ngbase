# Selectable

```typescript
import { Selectable, SelectableItem } from '@/ui/selectable';
```

## Components

### `mee-selectable`

- **Inputs**
  - `activeIndex`: number - Active index (2way)
- **Outputs**
  - `activeIndexChange`: EventEmitter<number> - Active index changed event
  - `valueChanged`: EventEmitter<any> - Value changed event
- **Export** - `meeSelectable` - Template reference

### `mee-selectable-item, [meeSelectableItem]`

- **Inputs**
  - `value`: any - Value
- **Export** - `meeSelectableItem` - Template reference

## Usage

```html
<mee-selectable [(activeIndex)]="activeIndex">
  <mee-selectable-item value="1">Item 1</mee-selectable-item>
  <button meeSelectableItem value="2">Item 2</button>
</mee-selectable>
```
