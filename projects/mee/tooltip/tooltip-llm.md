# Tooltip

```typescript
import { Tooltip } from '@/ui/tooltip';
```

## Components

PopoverPosition =
| 'top'
| 'bottom'
| 'left'
| 'right'
| 'rs'
| 're'
| 'ls'
| 'le'
| 'tl'
| 'tr'
| 'bl'
| 'br';

### `mee-tooltip`

- **inputs**

  - `meeTooltip`: string
  - `meeTooltipPosition`: PopoverPosition
  - `delay`: number

- **exports** - `meeTooltip`

## Usage

```html
<mee-tooltip meeTooltip="Tooltip content" [delay]="100" />
```
