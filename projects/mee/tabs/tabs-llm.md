## Tabs

```typescript
import { Tabs, Tab, TabHeader, TabLazy } from '@/ui/tabs';
```

### `mee-tabs`

- **inputs**

  - `selectedIndex`: number (2way)

- **outputs**
  - `selectedTabChange`: `EventEmitter<TabChangeEvent>`

### `mee-tab`

- **inputs**

  - `label`: string
  - `disabled`: boolean
  - `mode`: 'hidden' | 'lazy'
  - `value`: string | number

- **exports** - `meeTab`

### `mee-tab-header`

- **exports** - `meeTabHeader`

### `mee-tab-lazy`

Use it to render the tab every time user visit the tab

- **exports** - `meeTabLazy`

## Usage

```html
<mee-tabs [(selectedIndex)]="selectedIndex">
  <mee-tab label="Tab 1">Tab 1 Content</mee-tab>
  <mee-tab>
    <h4 *meeTabHeader>Tab 2</h4>
    Tab 2 Content
  </mee-tab>
  <mee-tab *meeTabLazy="let tab"> Tab 3 </mee-tab>
</mee-tabs>
```
