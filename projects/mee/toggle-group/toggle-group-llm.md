# Toggle

```typescript
import { ToggleGroup, ToggleItem } from '@/ui/toggle-group';
```

### `mee-toggle-group`

- **inputs**

  - `value`: boolean (2way)
  - `multiple`: boolean

- **exports** - `meeToggleGroup`

### `mee-toggle-item`

- **inputs**

  - `value`: boolean
  - `disabled`: boolean

- **exports** - `meeToggleItem`

## Usage

```html
<mee-toggle-group [(value)]="value" [multiple]="multiple">
  <button meeToggleItem value="1">1</button>
  <button meeToggleItem value="2">2</button>
</mee-toggle-group>
```
