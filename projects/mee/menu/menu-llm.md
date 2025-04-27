# Menu

```typescript
import { Menu, MenuTrigger, MenuContent } from '@/ui/menu';
```

## Components

### `mee-menu`

- **Exports** - `meeMenu`

### `meeMenuContent`

### `meeMenuTrigger`

- **Inputs**
  - `meeMenuTrigger`: meeMenu - Menu reference
- **Exports** - `meeMenuTrigger`

## Menu Usage

```html
<button [meeMenuTrigger]="menu">Menu</button>
<mee-menu #menu>
  <button>Item 1</button>
  <button>Item 2</button>
</mee-menu>

<button [meeMenuTrigger]="menu1" [meeMenuTriggerData]="{ data: 'Custom data' }">Menu</button>
<mee-menu #menu1>
  <ng-template meeMenuContent let-data="data">
    <button meeList>{{ data }}</button>
    <button meeList>Item 2</button>
  </ng-template>
</mee-menu>
```
