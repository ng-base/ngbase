# MEE Dialog

```typescript
import { dialogPortal } from '@/ui/dialog';
```

## Notes:

DialogOptions:

- backdrop: boolean - Whether to show a backdrop
- backdropColor: boolean - Whether to use the backdrop color
- hideOverlay: boolean - Whether to hide the overlay
- data: any - The data to pass to the dialog
- title: string - The title of the dialog
- fullWindow: boolean - Whether to use the full window
- minWidth: string - The minimum width of the dialog
- minHeight: string - The minimum height of the dialog
- width: string - The width of the dialog
- height: string - The height of the dialog
- maxWidth: string - The maximum width of the dialog
- maxHeight: string - The maximum height of the dialog
- classNames: string[] - The class names of the dialog
- header: boolean - Whether to show a header
- disableClose: boolean - Whether to disable the close button
- ayId: string - The id of the dialog
- focusTrap: boolean - Whether to focus the dialog
- afterFocusEl: HTMLElement - The element to focus after the dialog is opened

## Usage

```html
<ng-template #dialogTemplate>
  <div>
    <h1>Dialog</h1>
  </div>
</ng-template>
```

```typescript
import { DialogRef } from '@ngbase/adk/portal';
@Component({
  template: `content`,
})
export class AddTaskComponent {
  readonly dialogRef = inject<DialogRef<Task>>(DialogRef);
  readonly data = this.dialogRef.data;

  close() {
    this.dialogRef.close(data);
  }
}

const ref = dialog.open(AddTaskComponent, {
  backdrop: true,
  hideOverlay: false,
  data: {},
});

ref.afterClosed.subscribe(data => {
  console.log(data);
});

dialog.open(dialogContent(), {
  backdrop: true,
  hideOverlay: false,
  data: {},
});
```
