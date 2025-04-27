# MEE Accordion

```typescript
import { Accordion, AccordionGroup, AccordionHeader } from '@/ui/accordion';
```

## Components

### `<mee-accordion-group>`

- **Input:** `[multiple]`: boolean = false - Allow multiple open items

### `<mee-accordion>`

- **Inputs:**
  - `[expanded]`: boolean = false - Item expanded state (2way)
  - `[disabled]`: boolean = false - Disable interaction
- **Output:** `(expandedChange)`: EventEmitter<boolean> - On state change
- **Method:** `toggle()` - Toggle expanded state
- **Export:** `#accordion="meeAccordion"` - Template reference

### `[meeAccordionHeader]`

- Directive for header element

## Examples

```html
<mee-accordion-group>
  <mee-accordion>
    <div meeAccordionHeader>Title</div>
    <p>Content</p>
  </mee-accordion>
</mee-accordion-group>
```
