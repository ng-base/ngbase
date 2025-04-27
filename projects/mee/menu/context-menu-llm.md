# Menu

```typescript
import { Menu, MenuTrigger, MenuContent } from '@/ui/menu';
```

## Components

### `[meeContextMenu]`

- **Inputs**
  - `meeContextMenu`: Menu - Menu reference
- **Outputs**
  - `ctxOpen`: EventEmitter<void> - Emits when the context menu is opened
  - `ctxClose`: EventEmitter<void> - Emits when the context menu is closed
- **Exports** - `meeContextMenu`

## Usage

```html
<button [meeContextMenu]="menu">Context Menu</button>
<mee-menu #menu>
  <button>Item 1</button>
  <button>Item 2</button>
</mee-menu>
```

## Context Menu
