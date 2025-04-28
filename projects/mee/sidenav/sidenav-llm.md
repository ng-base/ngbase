# Sidenav

```typescript
import { Sidenav, SidenavHeader } from '@/ui/sidenav';
```

## Components

### `mee-sidenav`

- **Inputs**
  - `show`: boolean - Whether to show the sidenav (2way)
  - `mode`: 'side' | 'over' - The mode of the sidenav
- **Outputs**
  - `showChange`: EventEmitter<boolean> - Show changed event
- **Export** - `meeSidenav` - Template reference

### `mee-sidenav-header`

- **Inputs**
  - `width`: string - The width of the sidenav
  - `minWidth`: string - The minimum width of the sidenav
- **Export** - `meeSidenavHeader` - Template reference

## Usage

```html
<mee-sidenav [show]="show()" [mode]="mode()">
  <mee-sidenav-header width="100px" minWidth="50px">
    <div class="p-2">Collapsible content like side menu</div>
  </mee-sidenav-header>
  <div class="p-2">
    <p>Main content</p>
    <button (click)="toggle()">Toggle</button>
  </div>
</mee-sidenav>
```
