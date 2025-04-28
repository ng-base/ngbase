# MEE Drawer

```typescript
import { drawerPortal } from '@/ui/drawer';
```

## Notes:

DrawerOptions:

- backdrop: boolean - Whether to show a backdrop
- backdropColor: boolean - Whether to use the backdrop color
- hideOverlay: boolean - Whether to hide the overlay
- data: any - The data to pass to the drawer
- title: string - The title of the drawer
- fullWindow: boolean - Whether to use the full window
- minWidth: string - The minimum width of the drawer
- minHeight: string - The minimum height of the drawer
- width: string - The width of the drawer
- height: string - The height of the drawer
- maxWidth: string - The maximum width of the drawer
- maxHeight: string - The maximum height of the drawer
- classNames: string[] - The class names of the drawer
- header: boolean - Whether to show a header
- disableClose: boolean - Whether to disable the close button
- ayId: string - The id of the drawer
- focusTrap: boolean - Whether to focus the drawer
- afterFocusEl: HTMLElement - The element to focus after the drawer is opened

## Usage

```html
<ng-template #drawerContent>
  <div>
    <h1>Drawer</h1>
  </div>
</ng-template>
```

```typescript
const drawer = drawerPortal();

drawer.open(DrawerComponent, {
  backdrop: true,
  hideOverlay: false,
  data: {},
});

drawer.open(drawerContent, {
  backdrop: true,
  hideOverlay: false,
  data: {},
});
```
