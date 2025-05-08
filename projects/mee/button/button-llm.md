# MEE Button

```typescript
import { Button } from '@/ui/button';
```

## Components

### `[meeButton]`

- ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'icon'
- **Inputs:**

  - `variant`: ButtonVariant = 'primary'

- **Export:** `#button="meeButton"` - Template reference

## Usage

```html
<button meeButton>Button</button> <button meeButton variant="ghost">Button</button>
<button meeButton="icon">
  <mee-icon name="lucideHouse" />
</button>
```

Note: When you use icon as button, then make sure to use icon variant
