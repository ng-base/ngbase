# Sonner

```typescript
import { sonnerPortal } from '@/ui/sonner';
```

## Notes

- **Methods**
  - `add(message: string, data?: SonnerData)`: void - Add a message
  - `closeAll()`: void - Close all messages
  - `success(message: string, data?: SonnerData)`: void - Add a success message
  - `error(message: string, data?: SonnerData)`: void - Add an error message
  - `warning(message: string, data?: SonnerData)`: void - Add a warning message
  - `info(message: string, data?: SonnerData)`: void - Add an info message

## Usage

```html
<button meeButton (click)="addMessage()">Add Message</button>
<button meeButton (click)="clearMessage()">Clear Message</button>
```

```typescript
sonner = sonnerPortal();

addMessage() {
  this.sonner.add('Event has been created', 'Sunday, December 03, 2023 at 9:00 AM');
}

clearMessage() {
  this.sonner.closeAll();
}
```
