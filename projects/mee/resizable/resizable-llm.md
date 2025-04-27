# Resizable

```typescript
import { Resizable, ResizableGroup } from '@/ui/resizable';
```

## Components

### `mee-resizable-group`

- **Inputs**
  - `direction`: 'horizontal' | 'vertical' = 'horizontal' - The direction of the resizable group
- **Exports** - `meeResizableGroup`

### `mee-resizable`

- **Inputs**
  - `size`: number | string = 'auto' - The size of the resizable
  - `min`: number | string = 0 - The minimum size of the resizable
  - `max`: number | string = undefined - The maximum size of the resizable
- **Exports** - `meeResizable`

## Usage

```html
<mee-resizable-group>
  <mee-resizable size="100px" />
  <mee-resizable size="300px" />
  <mee-resizable />
</mee-resizable-group>
```
