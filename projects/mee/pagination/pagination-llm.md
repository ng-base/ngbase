# Pagination

```typescript
import { Pagination } from '@/ui/pagination';
```

## Components

### `mee-pagination`

- **Inputs**
  - `size`: number - The size of the pagination (2way)
  - `active`: number - The active page (2way)
  - `total`: number - The total number of pages
  - `sizeOptions`: number[] - The options for the size of the pagination
- **Outputs**
  - `valueChanged`: EventEmitter<number> - Emits when the value changes
- **Exports** - `meePagination`

## Usage

```html
<mee-pagination
  [size]="10"
  [active]="1"
  [total]="100"
  [sizeOptions]="[10, 20, 50, 100]"
></mee-pagination>
```
