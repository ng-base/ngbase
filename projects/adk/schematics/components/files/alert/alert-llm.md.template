# MEE Alert

```typescript
import { alertPortal } from '@/ui/alert';
```

## Usage

```ts
const alert = alertPortal();
alert.open({
  title: 'Alert',
  description: 'This is an alert',
  actions: [
    {
      text: 'Cancel',
      type: 'secondary', // ButtonVariant
      handler: close => close(),
    },
    {
      text: 'OK',
      type: 'primary', // ButtonVariant
      handler: close => {
        okHandler();
        close();
      },
    },
  ],
});

function okHandler() {
  console.log('OK');
}
```
