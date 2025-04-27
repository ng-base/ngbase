# Hover Card

```typescript
import { HoverCard } from '@/ui/hover-card';
```

## Components

### `mee-hover-card`

- **Inputs**
  - `meeHoverCard`: TemplateRef<any> - The template to show when hovering over the element
  - `options`: PopoverOptions - The options for the hover card
  - `delay`: number - The delay in milliseconds before the hover card is shown

## Usage

```html
<button [meeHoverCard]="myTemplate" meeButton="ghost" class="underline">
  Hover over to show hover card
</button>

<ng-template #myTemplate>
  <div>Hover card content</div>
</ng-template>
```
