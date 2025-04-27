# Popover

```typescript
import { popoverPortal, PopoverTrigger, PopoverClose } from '@/ui/popover';
```

## Components

### `meePopoverTrigger`

- **Inputs**
  - `meePopoverTrigger`: Popover - Popover reference
  - `meePopoverTriggerData`: any - The data to pass to the popover
  -
- **Outputs**
- **Exports** - `meePopoverTrigger`

### `meePopoverClose`

- **Inputs**
  - `meePopoverClose`: any - The data to pass to the afterClose event
- **Exports** - `meePopoverClose`

## Usage

```html
<div [meePopoverTrigger]="popoverTemplate"></div>

<ng-template #popoverTemplate>
  <div>
    <h1>Popover</h1>
  </div>
</ng-template>
```

```typescript
class PopoverComponent {
  readonly popover = popoverPortal();
  readonly popoverTemplate = viewChild<TemplateRef<any>>('popoverTemplate');

  open() {
    const dialogRef = this.dialog.open(Component, {
      data: {
        message: 'Hello, world!',
      },
    });
    or;
    const dialogRef = this.dialog.open(popoverTemplate, {
      data: {
        message: 'Hello, world!',
      },
    });

    dialogRef.afterClosed.subscribe(data => {
      console.log(data);
    });
  }
}
```
