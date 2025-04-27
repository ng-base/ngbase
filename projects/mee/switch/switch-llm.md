# Switch

```typescript
import { Switch } from '@/ui/switch';
```

## Components

### `mee-switch`

- **Inputs**
  - `checked`: boolean = false - Whether the switch is checked (2way)
  - `disabled`: boolean = false - Whether the switch is disabled
- **Outputs**
  - `checkedChange`: EventEmitter<boolean> - Emits the checked value when it changes
  - `change`: EventEmitter<boolean> - Emits the checked value when it changes
- **Export** - `meeSwitch` - Template reference

## Usage

```html
<mee-switch [(checked)]="checked" [disabled]="disabled()"></mee-switch>
```
