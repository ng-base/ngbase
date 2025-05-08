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

```typescript
@Component({
  standalone: true,
  imports: [Sidenav, SidenavHeader],
  template: ` <mee-sidenav [show]="show()" [mode]="mode()">
    <mee-sidenav-header width="100px" minWidth="50px">
      <div class="p-2">Collapsible content like side menu</div>
    </mee-sidenav-header>
    <div class="p-2">
      <button meeButton="icon" (click)="toggle()">
        <mee-icon name="lucideMenu" />
      </button>
      <p>Main content</p>
    </div>
  </mee-sidenav>`,
})
export class AppComponent {
  readonly show = signal(false);
  readonly mode = signal<'side' | 'over'>('side');
  toggle() {
    this.show.update(show => !show);
  }
}
```
