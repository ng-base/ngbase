# MEE Breadcrumb

```typescript
import { Breadcrumb, Breadcrumbs, BreadcrumbsSeparator } from '@/ui/breadcrumb';
```

## Components

### `<mee-breadcrumbs>`

### `<mee-breadcrumb>`

### `<mee-breadcrumbs-separator>` - Optional

## Usage

```html
<mee-breadcrumbs>
  <ng-template meeBreadcrumbsSeparator>
    <mee-icon name="lucideChevronRight"></mee-icon>
  </ng-template>

  <a meeBreadcrumb routerLink="/home">Home</a>
  <mee-breadcrumb>Contact</mee-breadcrumb>
</mee-breadcrumbs>
```
