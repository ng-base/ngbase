# Sheet

```typescript
import { sheetPortal } from '@/ui/sheet';
```

## Notes:

SheetOptions:

- backdrop: boolean - Whether to show a backdrop
- backdropColor: boolean - Whether to use the backdrop color
- hideOverlay: boolean - Whether to hide the overlay
- data: any - The data to pass to the sheet
- title: string - The title of the sheet
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
<ng-template #sheetContent>
  <div>
    <h1>Sheet</h1>
  </div>
</ng-template>
```

```typescript
const sheet = sheetPortal();

sheet.open(SheetComponent, {
  backdrop: true,
  hideOverlay: false,
  data: {},
});

sheet.open(sheetContent, {
  backdrop: true,
  hideOverlay: false,
  data: {},
});
```
