# MEE Color Picker

```typescript
import { FormField, Label } from '@/ui/form-field';
import { ColorInput } from '@/ui/color-picker';
```

## Components

### `<mee-color-input>`

ColorFormat: `hex` | `rgb` | `hsl` | `hsb`

- **Inputs:**

  - `format`: ColorFormat - The format of the color input
  - `presetColors`: string[] - The preset colors of the color input
  - `value`: string - The value of the color input (2way)

## Usage

```html
<mee-form-field>
  <label meeLabel>Color</label>
  <mee-color-input [format]="format" [presetColors]="presetColors" [(value)]="value" />
</mee-form-field>
```
