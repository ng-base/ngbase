# Icon

```typescript
import { Icon } from '@/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideHouse } from '@ng-icons/lucide';
```

## Components

### `mee-icon`

- **Inputs**
  - `name`: string - The name of the icon to display
  - `size`: string - The size of the icon to display

## Usage

```typescript
@Component({
  standalone: true,
  viewProviders: [provideIcons({ lucideHouse })],
  imports: [Icon],
  template: `<mee-icon name="lucideHouse" />`,
})
export class AppComponent {}
```
